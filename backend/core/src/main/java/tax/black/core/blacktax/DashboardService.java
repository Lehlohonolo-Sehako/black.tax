package tax.black.core.blacktax;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tax.black.core.domain.AgentDecision;
import tax.black.core.domain.Debt;
import tax.black.core.domain.LedgerEntry;
import tax.black.core.domain.Member;
import tax.black.core.domain.Stokvel;
import tax.black.core.domain.enumeration.DebtStatus;
import tax.black.core.domain.enumeration.DecisionType;
import tax.black.core.domain.enumeration.LedgerEntryType;
import tax.black.core.domain.enumeration.MandateStatus;
import tax.black.core.domain.enumeration.StokvelType;
import tax.black.core.repository.AgentDecisionRepository;
import tax.black.core.repository.LedgerEntryRepository;
import tax.black.core.service.api.dto.AgentStatusDto;
import tax.black.core.service.api.dto.DashboardDto;
import tax.black.core.service.api.dto.DashboardNextPayoutDto;
import tax.black.core.service.api.dto.DashboardRecycledByMonthInnerDto;

/** Home figures. Debt remaining = Σ member balances; pool = last ledger running balance. Nothing is stored twice. */
@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final Tenant tenant;
    private final LedgerEntryRepository ledger;
    private final AgentDecisionRepository decisions;
    private final Mappers map;

    public DashboardService(Tenant tenant, LedgerEntryRepository ledger, AgentDecisionRepository decisions, Mappers map) {
        this.tenant = tenant;
        this.ledger = ledger;
        this.decisions = decisions;
        this.map = map;
    }

    /** Interest paid if the member only ever paid their own minimum. */
    public static BigDecimal interestOnMinimums(BigDecimal start, BigDecimal ratePct, BigDecimal minimum) {
        double bal = start.doubleValue(), r = ratePct.doubleValue() / 100 / 12, min = minimum.doubleValue(), interest = 0;
        for (int i = 0; i < 600 && bal > 0.005; i++) {
            double inMonth = bal * r;
            interest += inMonth;
            bal = bal + inMonth - min;
        }
        return BigDecimal.valueOf(interest).setScale(0, RoundingMode.HALF_UP).setScale(2);
    }

    /** Interest that accrued while the group cleared it: average balance × rate × months held. */
    public static BigDecimal interestWhileClearing(BigDecimal start, BigDecimal ratePct, int months) {
        return start.divide(BigDecimal.TWO).multiply(ratePct).divide(BigDecimal.valueOf(1200), 6, RoundingMode.HALF_UP)
            .multiply(BigDecimal.valueOf(Math.max(1, months))).setScale(0, RoundingMode.HALF_UP).setScale(2);
    }

    public DashboardDto dashboard() {
        Stokvel s = tenant.stokvel();
        List<Member> members = tenant.members();
        Map<String, Debt> debts = tenant.debtsByMember();
        List<LedgerEntry> entries = ledger.findAllByOrderByRecordedAtAscIdAsc();
        BigDecimal pool = entries.isEmpty() ? M.ZERO : entries.get(entries.size() - 1).getRunningBalance();
        BigDecimal reserve = s.getReserveFloor();
        BigDecimal above = pool.subtract(reserve).max(M.ZERO);
        LocalDate today = map.today();
        YearMonth thisMonth = YearMonth.from(today);

        DashboardDto d = new DashboardDto()
            .stokvelId(s.getCode())
            .poolBalance(M.s(pool))
            .reserveFloor(M.s(reserve))
            .aboveReserve(M.s(above))
            .memberCount(members.size());

        BigDecimal added = M.ZERO, recycledThisMonth = M.ZERO;
        for (LedgerEntry e : entries) {
            YearMonth ym = YearMonth.from(e.getRecordedAt().atZone(M.SAST));
            if (ym.equals(thisMonth) && (e.getEntryType() == LedgerEntryType.CONTRIBUTION || e.getEntryType() == LedgerEntryType.RECYCLED)) {
                added = added.add(e.getAmount());
            }
            if (ym.equals(thisMonth) && e.getEntryType() == LedgerEntryType.RECYCLED) recycledThisMonth = recycledThisMonth.add(e.getAmount());
        }
        d.addedThisMonth(M.s(added)).recycledThisMonth(M.s(recycledThisMonth));

        if (s.getStokvelType() == StokvelType.DEBT_PAYOFF) {
            BigDecimal start = M.ZERO, remaining = M.ZERO, saved = M.ZERO;
            int free = 0;
            Member current = null;
            for (Member m : members) {
                Debt debt = debts.get(m.getCode());
                if (debt == null) continue;
                start = start.add(debt.getStartBalance());
                remaining = remaining.add(debt.getBalance());
                if (debt.getStatus() == DebtStatus.CLEARED) {
                    free++;
                    int held = s.getStartedOn() == null || debt.getClearedDate() == null ? 1
                        : (int) java.time.temporal.ChronoUnit.MONTHS.between(YearMonth.from(s.getStartedOn()), YearMonth.from(debt.getClearedDate())) + 1;
                    saved = saved.add(interestOnMinimums(debt.getStartBalance(), debt.getInterestRate(), debt.getMinimumPayment())
                        .subtract(interestWhileClearing(debt.getStartBalance(), debt.getInterestRate(), held)).max(M.ZERO));
                } else if (current == null) current = m;
            }
            BigDecimal cleared = start.subtract(remaining);
            d.debtAtStart(M.s(start)).debtRemaining(M.s(remaining)).clearedSinceStart(M.s(cleared))
                .clearedPct(start.signum() == 0 ? BigDecimal.ZERO : cleared.multiply(BigDecimal.valueOf(100)).divide(start, 1, RoundingMode.HALF_UP))
                .interestSaved(M.s(saved)).membersFree(free);

            // Recycled per month since the stokvel started.
            List<DashboardRecycledByMonthInnerDto> byMonth = new ArrayList<>();
            if (s.getStartedOn() != null) {
                for (YearMonth ym = YearMonth.from(s.getStartedOn()); !ym.isAfter(thisMonth); ym = ym.plusMonths(1)) {
                    BigDecimal sum = M.ZERO;
                    for (LedgerEntry e : entries) {
                        if (e.getEntryType() == LedgerEntryType.RECYCLED && YearMonth.from(e.getRecordedAt().atZone(M.SAST)).equals(ym)) sum = sum.add(e.getAmount());
                    }
                    byMonth.add(new DashboardRecycledByMonthInnerDto().month(ym.toString()).amount(M.s(sum)));
                }
            }
            d.recycledByMonth(byMonth);

            if (current != null) {
                BigDecimal contributions = members.stream()
                    .filter(m -> m.getMandateStatus() == MandateStatus.ACTIVE)
                    .map(Member::getContributionAmount).reduce(M.ZERO, BigDecimal::add);
                LocalDate payout = today.getDayOfMonth() < 2 ? today.withDayOfMonth(2) : today.plusMonths(1).withDayOfMonth(2);
                d.nextPayout(new DashboardNextPayoutDto().date(payout).amount(M.s(contributions.add(above))).memberId(current.getCode()));
            }
        } else if (s.getPayoutDate() != null) {
            d.nextPayout(new DashboardNextPayoutDto().date(s.getPayoutDate()).amount(M.s(pool)));
        }

        d.agentStatus(agentStatus(s, entries.isEmpty(), members));
        return d;
    }

    private AgentStatusDto agentStatus(Stokvel s, boolean noLedger, List<Member> members) {
        var last = decisions.findFirstByOrderByDecidedAtDescIdDesc();
        if (Boolean.TRUE.equals(s.getPaused())) {
            AgentDecision pause = decisions.findAllByOrderByDecidedAtDescIdDesc().stream()
                .filter(x -> x.getDecisionType() == DecisionType.PAUSE).findFirst().orElse(null);
            return new AgentStatusDto().state(AgentStatusDto.StateEnum.PAUSED)
                .since(s.getPausedSince() == null ? null : s.getPausedSince().atZone(M.SAST).toOffsetDateTime())
                .message(pause == null ? "I paused payouts." : pause.getRuleApplied())
                .decisionId(pause == null ? null : pause.getCode());
        }
        if (noLedger) {
            long active = members.stream().filter(m -> m.getMandateStatus() == MandateStatus.ACTIVE).count();
            return new AgentStatusDto().state(AgentStatusDto.StateEnum.WAITING)
                .message("Waiting for the first contribution. Invite your members to begin. " + active + " of " + members.size() + " mandates active.");
        }
        return new AgentStatusDto().state(AgentStatusDto.StateEnum.ACTIVE)
            .checkedAt(last.map(x -> x.getDecidedAt().atZone(M.SAST).toOffsetDateTime()).orElse(null))
            .message(last.map(AgentDecision::getOutcome).orElse("Watching the pool."))
            .decisionId(last.map(AgentDecision::getCode).orElse(null));
    }
}
