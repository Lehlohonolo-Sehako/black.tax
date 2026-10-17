package tax.black.core.blacktax;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tax.black.core.domain.AgentDecision;
import tax.black.core.domain.Debt;
import tax.black.core.domain.LedgerEntry;
import tax.black.core.domain.Member;
import tax.black.core.domain.Notification;
import tax.black.core.domain.Stokvel;
import tax.black.core.domain.enumeration.AgentOutcome;
import tax.black.core.domain.enumeration.DebtStatus;
import tax.black.core.domain.enumeration.DecisionType;
import tax.black.core.domain.enumeration.LedgerEntryType;
import tax.black.core.repository.AgentDecisionRepository;
import tax.black.core.repository.DebtRepository;
import tax.black.core.repository.MemberRepository;
import tax.black.core.repository.NotificationRepository;
import tax.black.core.repository.StokvelRepository;
import tax.black.core.service.api.dto.AgentActionDto;
import tax.black.core.service.api.dto.AgentDecisionDto;
import tax.black.core.service.api.dto.KeyValueDto;
import tax.black.core.service.api.dto.RecordDecisionRequestDto;
import tax.black.core.tenancy.TenantContext;

/** Stores agent decisions, mirrors their ledger entries and applies their effects to business records. */
@Service
@Transactional
public class DecisionService {

    private final AgentDecisionRepository decisions;
    private final NotificationRepository notifications;
    private final StokvelRepository stokvels;
    private final DebtRepository debts;
    private final MemberRepository members;
    private final LedgerService ledger;
    private final Mappers map;
    private final Clock clock;

    public DecisionService(AgentDecisionRepository decisions, NotificationRepository notifications, StokvelRepository stokvels,
        DebtRepository debts, MemberRepository members, LedgerService ledger, Mappers map, Clock clock) {
        this.decisions = decisions;
        this.notifications = notifications;
        this.stokvels = stokvels;
        this.debts = debts;
        this.members = members;
        this.ledger = ledger;
        this.map = map;
        this.clock = clock;
    }

    public String nextCode() {
        String tenant = TenantContext.get();
        String p = switch (tenant) {
            case "masakhane" -> "D-";
            case "grocery" -> "G-";
            default -> (tenant.isEmpty() ? "X" : tenant.substring(0, 1).toUpperCase()) + "D-";
        };
        int max = decisions.findByTenantId(tenant).stream().map(AgentDecision::getCode).filter(c -> c.startsWith(p)).mapToInt(c -> {
            try {
                return Integer.parseInt(c.substring(p.length()));
            } catch (NumberFormatException e) {
                return 0;
            }
        }).max().orElse(0);
        return p + String.format("%02d", max + 1);
    }

    public AgentDecisionDto record(RecordDecisionRequestDto req) {
        Instant now = clock.instant();
        String code = nextCode();
        LedgerEntry entry = null;
        String arcTx = null;
        if (req.getLedger() != null) {
            var l = req.getLedger();
            if (l.getType() == null || l.getDescription() == null || l.getDescription().isBlank() || l.getAmount() == null) {
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST,
                    "A ledger entry needs a type, a description and an amount.");
            }
            arcTx = l.getArcTxHash();
            entry = ledger.mirror(null, LedgerEntryType.valueOf(l.getType().name()), l.getDescription(), l.getCounterparty(),
                M.nz(M.d(l.getAmount())), null, req.getRuleApplied(), code, arcTx, now, l.getBeancount(), l.getBeancountHash());
        }
        AgentDecision d = decisions.save(new AgentDecision()
            .tenantId(TenantContext.get())
            .code(code)
            .decidedAt(now)
            .decisionType(DecisionType.valueOf(req.getType().name()))
            .outcomeType(AgentOutcome.valueOf(req.getDecision().name()))
            .triggerType(req.getTrigger() == null ? null : req.getTrigger().name())
            .summary(req.getSummary())
            .inputs(map.inputsJson(req.getInputs()))
            .ruleApplied(req.getRuleApplied())
            .outcome(req.getOutcome())
            .ledgerEntryCode(entry == null ? null : entry.getCode())
            .arcTxHash(arcTx));
        apply(d, req.getActions());
        if (d.getDecisionType() != DecisionType.HOLD && d.getDecisionType() != DecisionType.ASSESS) {
            notifications.save(new Notification().tenantId(TenantContext.get()).sentAt(now).text(d.getSummary())
                .decisionCode(code).decisionType(d.getDecisionType()).unread(true));
        }
        return map.decision(d);
    }

    /** Treasurer resumes a pause by hand. */
    public AgentDecisionDto treasurerResume(String treasurerName) {
        var req = new RecordDecisionRequestDto()
            .trigger(tax.black.core.service.api.dto.TriggerDto.MANUAL)
            .type(tax.black.core.service.api.dto.DecisionTypeDto.RESUME)
            .decision(tax.black.core.service.api.dto.AgentOutcomeDto.NO_ACTION)
            .summary("Resumed payouts. " + treasurerName + " overrode the pause.")
            .inputs(List.of(new KeyValueDto().label("Override by").value(treasurerName + ", treasurer")))
            .ruleApplied("The treasurer can override a pause. I'll pay out at the next tick if the pool is above the reserve floor.")
            .outcome("Payouts resumed. Logged to the ledger.");
        AgentDecisionDto dto = record(req);
        ledger.record(LedgerEntryType.CONSTITUTION_CHANGE, treasurerName + " resumed payouts, overriding the agent's pause", treasurerName,
            BigDecimal.ZERO, null, null, dto.getId(), null, clock.instant());
        return dto;
    }

    private void apply(AgentDecision d, List<AgentActionDto> actions) {
        Stokvel s = stokvels.findOneByCode(TenantContext.get()).orElseThrow();
        if (d.getDecisionType() == DecisionType.PAUSE) {
            if (!Boolean.TRUE.equals(s.getPaused())) s.paused(true).pausedSince(d.getDecidedAt());
        } else if (d.getDecisionType() == DecisionType.RESUME || d.getOutcomeType() == AgentOutcome.EXECUTE) {
            s.paused(false).pausedSince(null);
        }
        stokvels.save(s);
        if (actions == null) return;
        for (AgentActionDto a : actions) {
            boolean pays = a.getType() == AgentActionDto.TypeEnum.EFT_PAYMENT || a.getType() == AgentActionDto.TypeEnum.ARC_ESCROW_RELEASE;
            if (!pays || a.getMemberId() == null || a.getAmount() == null) continue;
            Debt debt = debts.findOneByMemberCode(a.getMemberId()).orElse(null);
            if (debt == null) continue;
            BigDecimal left = debt.getBalance().subtract(M.d(a.getAmount()));
            if (left.signum() <= 0) {
                debt.balance(M.ZERO).status(DebtStatus.CLEARED).clearedDate(map.today());
                Member m = debt.getMember();
                if (Boolean.TRUE.equals(s.getRecyclingEnabled())) {
                    int pct = s.getRecyclingPercentage() == null ? 100 : s.getRecyclingPercentage();
                    m.recycledMinimum(debt.getMinimumPayment().multiply(BigDecimal.valueOf(pct)).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP));
                    members.save(m);
                }
            } else {
                debt.balance(left);
            }
            debts.save(debt);
        }
    }
}
