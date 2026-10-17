package tax.black.core.blacktax;

import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;
import tax.black.core.domain.AgentDecision;
import tax.black.core.domain.Contribution;
import tax.black.core.domain.Debt;
import tax.black.core.domain.LedgerEntry;
import tax.black.core.domain.Loan;
import tax.black.core.domain.LoanRequest;
import tax.black.core.domain.Member;
import tax.black.core.domain.Notification;
import tax.black.core.domain.Stokvel;
import tax.black.core.domain.enumeration.DebtStatus;
import tax.black.core.domain.enumeration.DecisionType;
import tax.black.core.service.api.dto.*;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Entity → API DTO. The only place that knows both shapes. */
@Component
public class Mappers {

    private final ObjectMapper json;
    private final java.time.Clock clock;

    public Mappers(ObjectMapper json, java.time.Clock clock) {
        this.json = json;
        this.clock = clock;
    }

    public LocalDate today() {
        return LocalDate.now(clock.withZone(M.SAST));
    }

    public int currentMonth(Stokvel s) {
        if (s.getStartedOn() == null || s.getStartedOn().isAfter(today())) return 0;
        Period p = Period.between(s.getStartedOn().withDayOfMonth(1), today().withDayOfMonth(1));
        return p.getYears() * 12 + p.getMonths() + 1;
    }

    public StokvelDto stokvel(Stokvel s, int memberCount) {
        StokvelDto d = new StokvelDto()
            .id(s.getCode())
            .name(s.getName())
            .type(StokvelTypeDto.fromValue(s.getStokvelType().name()))
            .contributionAmount(M.s(s.getContributionAmount()))
            .frequency(FrequencyDto.fromValue(s.getFrequency().name()))
            .collectionDay(s.getCollectionDay())
            .reserveFloor(M.s(s.getReserveFloor()))
            .lendingEnabled(Boolean.TRUE.equals(s.getLendingEnabled()))
            .lendingCutoffDays(s.getLendingCutoffDays())
            .payoutDate(s.getPayoutDate())
            .target(M.s(s.getTarget()))
            .startedOn(s.getStartedOn())
            .currentMonth(currentMonth(s))
            .totalMonths(s.getTotalMonths())
            .memberCount(memberCount)
            .autonomous(Boolean.TRUE.equals(s.getAutonomous()))
            .walletAddress(s.getWalletAddress())
            .createdAt(s.getCreatedAt() == null ? null : s.getCreatedAt().atOffset(ZoneOffset.ofHours(2)));
        if (s.getQueueOrder() != null) d.queueOrder(StokvelDto.QueueOrderEnum.fromValue(s.getQueueOrder()));
        if (s.getRecyclingEnabled() != null) {
            d.recycling(new RecyclingDto().enabled(s.getRecyclingEnabled())
                .percentage(s.getRecyclingPercentage() == null ? null : RecyclingDto.PercentageEnum.fromValue(s.getRecyclingPercentage()))
                .graceMonths(s.getRecyclingGraceMonths()));
        }
        return d;
    }

    public DebtDto debt(Debt d) {
        if (d == null) return null;
        return new DebtDto()
            .creditor(d.getCreditor() == null ? d.getKind() : d.getCreditor())
            .kind(d.getKind())
            .startBalance(M.s(d.getStartBalance()))
            .balance(M.s(d.getBalance()))
            .interestRate(d.getInterestRate())
            .minimumPayment(M.s(d.getMinimumPayment()))
            .status(DebtDto.StatusEnum.fromValue(d.getStatus().name()))
            .clearedDate(d.getClearedDate());
    }

    /** Members with queue status; `debts` by member code. The first un-cleared debt in queue order is CURRENT. */
    public List<MemberDto> roster(List<Member> members, Map<String, Debt> debts) {
        List<MemberDto> out = new ArrayList<>();
        boolean currentAssigned = false;
        for (Member m : members) {
            Debt debt = debts.get(m.getCode());
            QueueStatusDto qs = null;
            if (debt != null) {
                if (debt.getStatus() == DebtStatus.CLEARED) qs = QueueStatusDto.CLEARED;
                else if (!currentAssigned) {
                    qs = QueueStatusDto.CURRENT;
                    currentAssigned = true;
                } else qs = QueueStatusDto.WAITING;
            }
            out.add(member(m, debt).queueStatus(qs));
        }
        return out;
    }

    public MemberDto member(Member m, Debt debt) {
        return new MemberDto()
            .id(m.getCode())
            .userId(m.getUserLogin())
            .name(m.getName())
            .initials(m.getInitials() != null ? m.getInitials() : M.initials(m.getName()))
            .phone(m.getPhone())
            .role(RoleDto.fromValue(m.getRole().name()))
            .contributionAmount(M.s(m.getContributionAmount()))
            .mandateStatus(MandateStatusDto.fromValue(m.getMandateStatus().name()))
            .mandateId(m.getMandateId())
            .mandateCreated(m.getMandateCreated())
            .queuePosition(m.getQueuePosition())
            .projectedClearMonth(m.getProjectedClearMonth())
            .recycledMinimum(M.s(m.getRecycledMinimum()))
            .debt(debt(debt));
    }

    public ContributionDto contribution(Contribution c) {
        return new ContributionDto()
            .id(String.valueOf(c.getId()))
            .period(c.getPeriod())
            .amount(M.s(c.getAmount()))
            .dueDate(c.getDueDate())
            .collectedDate(c.getCollectedDate())
            .status(ContributionStatusDto.fromValue(c.getStatus().name()))
            .stitchPaymentId(c.getStitchPaymentId());
    }

    public LedgerEntryDto ledger(LedgerEntry e) {
        return new LedgerEntryDto()
            .id(e.getCode())
            .stokvelId(e.getTenantId())
            .timestamp(e.getRecordedAt().atZone(M.SAST).toOffsetDateTime())
            .type(LedgerEntryTypeDto.fromValue(e.getEntryType().name()))
            .counterparty(e.getCounterparty())
            .description(e.getDescription())
            .amount(M.s(e.getAmount()))
            .failedAmount(M.s(e.getFailedAmount()))
            .runningBalance(M.s(e.getRunningBalance()))
            .reasoning(e.getReasoning())
            .decisionId(e.getDecisionCode())
            .arcTxHash(e.getArcTxHash())
            .beancount(e.getBeancount())
            .beancountHash(e.getBeancountHash());
    }

    public static DecisionFilterDto filterOf(DecisionType t) {
        return switch (t) {
            case RECYCLE -> DecisionFilterDto.CONTRIBUTIONS;
            case CLEARED, PAYMENT -> DecisionFilterDto.CLEARED;
            case PAUSE, RESUME -> DecisionFilterDto.PAUSES;
            default -> DecisionFilterDto.LENDING;
        };
    }

    public String inputsJson(List<KeyValueDto> inputs) {
        return json.writeValueAsString(inputs == null ? List.of() : inputs);
    }

    public AgentDecisionDto decision(AgentDecision d) {
        List<KeyValueDto> inputs = d.getInputs() == null || d.getInputs().isBlank()
            ? List.of()
            : json.readValue(d.getInputs(), new TypeReference<List<KeyValueDto>>() {});
        return new AgentDecisionDto()
            .id(d.getCode())
            .stokvelId(d.getTenantId())
            .at(d.getDecidedAt().atZone(M.SAST).toOffsetDateTime())
            .type(DecisionTypeDto.fromValue(d.getDecisionType().name()))
            .filter(filterOf(d.getDecisionType()))
            .decision(d.getOutcomeType() == null ? null : AgentOutcomeDto.fromValue(d.getOutcomeType().name()))
            .summary(d.getSummary())
            .inputs(inputs)
            .ruleApplied(d.getRuleApplied())
            .outcome(d.getOutcome())
            .ledgerEntryId(d.getLedgerEntryCode())
            .arcTxHash(d.getArcTxHash());
    }

    public BorrowerProfileDto borrower(LoanRequest r) {
        return new BorrowerProfileDto()
            .stokvelId(r.getBorrowerCode())
            .name(r.getBorrowerName())
            .type(StokvelTypeDto.fromValue(r.getBorrowerType().name()))
            .members(r.getBorrowerMembers())
            .monthsActive(r.getMonthsActive())
            .contributionRecord(r.getContributionRecord())
            .priorLoans(r.getPriorLoans())
            .defaults(r.getPriorDefaults())
            .reserveBalance(M.s(r.getReserveBalance()))
            .reserveFloor(M.s(r.getBorrowerReserveFloor()))
            .walletAddress(r.getBorrowerWallet());
    }

    public LoanRequestDto loanRequest(LoanRequest r) {
        LoanRequestDto d = new LoanRequestDto()
            .id(r.getCode())
            .borrower(borrower(r))
            .amount(M.s(r.getAmount()))
            .termDays(r.getTermDays())
            .ratePct(r.getRatePct())
            .purpose(r.getPurpose())
            .dueDate(r.getDueDate())
            .interest(M.s(r.getInterest()))
            .escrowAddress(r.getEscrowAddress())
            .status(LoanRequestDto.StatusEnum.fromValue(r.getStatus().name()))
            .declineReason(r.getDeclineReason());
        if (r.getTier() != null) {
            d.assessment(new AssessmentDto()
                .tier(TierDto.fromValue(r.getTier().name()))
                .recommend(Boolean.TRUE.equals(r.getRecommend()))
                .reasoning(r.getReasoning())
                .note(r.getNote()));
        }
        return d;
    }

    public LoanDto loan(Loan l) {
        return new LoanDto()
            .id(l.getCode())
            .direction(LoanDirectionDto.fromValue(l.getDirection().name()))
            .counterparty(l.getCounterparty())
            .principal(M.s(l.getPrincipal()))
            .ratePct(l.getRatePct())
            .termDays(l.getTermDays())
            .repaid(M.s(l.getRepaid()))
            .totalDue(M.s(l.getTotalDue()))
            .dueDate(l.getDueDate())
            .status(LoanStatusDto.fromValue(l.getStatus().name()))
            .escrowJobId(l.getEscrowJobId())
            .escrowStatus(l.getEscrowStatus() == null ? null : EscrowStatusDto.fromValue(l.getEscrowStatus().name()))
            .arcTxHash(l.getArcTxHash())
            .disbursedAt(l.getDisbursedAt() == null ? null : l.getDisbursedAt().atZone(M.SAST).toOffsetDateTime())
            .repaidAt(l.getRepaidAt() == null ? null : l.getRepaidAt().atZone(M.SAST).toOffsetDateTime());
    }

    public NotificationDto notification(Notification n) {
        return new NotificationDto()
            .id(String.valueOf(n.getId()))
            .at(n.getSentAt().atZone(M.SAST).toOffsetDateTime())
            .text(n.getText())
            .decisionId(n.getDecisionCode())
            .decisionType(n.getDecisionType() == null ? null : DecisionTypeDto.fromValue(n.getDecisionType().name()))
            .unread(Boolean.TRUE.equals(n.getUnread()));
    }
}
