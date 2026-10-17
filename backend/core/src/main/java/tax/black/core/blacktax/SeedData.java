package tax.black.core.blacktax;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionTemplate;
import tax.black.core.domain.*;
import tax.black.core.domain.enumeration.*;
import tax.black.core.repository.*;
import tax.black.core.service.api.dto.KeyValueDto;
import tax.black.core.tenancy.TenantContext;
import tax.black.core.web.delegate.AuthDelegate;

/**
 * Demo data from the design handoff (code/mock-data.ts), "today" = 17 Oct 2026.
 * Every figure reconciles: debt remaining = Σ member balances; pool = last ledger running balance.
 * Ledger entries go through the ledger service, so each carries a real Beancount file hash.
 */
@Component
public class SeedData {

    private static final Logger LOG = LoggerFactory.getLogger(SeedData.class);

    private final Settings settings;
    private final StokvelRepository stokvels;
    private final MemberRepository members;
    private final DebtRepository debts;
    private final ContributionRepository contributions;
    private final AgentDecisionRepository decisions;
    private final NotificationRepository notifications;
    private final LoanRepository loans;
    private final LoanRequestRepository requests;
    private final UserRepository users;
    private final AuthDelegate auth;
    private final LedgerService ledger;
    private final Mappers map;
    private final TransactionTemplate tx;

    public SeedData(Settings settings, StokvelRepository stokvels, MemberRepository members, DebtRepository debts,
        ContributionRepository contributions, AgentDecisionRepository decisions, NotificationRepository notifications, LoanRepository loans,
        LoanRequestRepository requests, UserRepository users, AuthDelegate auth, LedgerService ledger, Mappers map, TransactionTemplate tx) {
        this.settings = settings;
        this.stokvels = stokvels;
        this.members = members;
        this.debts = debts;
        this.contributions = contributions;
        this.decisions = decisions;
        this.notifications = notifications;
        this.loans = loans;
        this.requests = requests;
        this.users = users;
        this.auth = auth;
        this.ledger = ledger;
        this.map = map;
        this.tx = tx;
    }

    private static Instant at(String iso) {
        return LocalDateTime.parse(iso).atZone(M.SAST).toInstant();
    }

    private static BigDecimal r(long v) {
        return BigDecimal.valueOf(v).setScale(2);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void seed() {
        if (!settings.seed || stokvels.findOneByCode("masakhane").isPresent()) return;
        for (int i = 0; i < 30; i++) {
            try {
                new org.springframework.web.client.RestTemplate().getForObject(settings.ledgerUrl + "/health", String.class);
                break;
            } catch (RuntimeException e) {
                LOG.info("Waiting for the ledger service before seeding…");
                try {
                    Thread.sleep(2000);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    return;
                }
            }
        }
        tx.executeWithoutResult(t -> {
            user("0825550147", "Naledi Mokoena");
            user("0613307742", "Bongani Zulu");
        });
        inTenant("masakhane", this::masakhane);
        inTenant("grocery", this::grocery);
        inTenant("kagiso", this::kagiso);
        LOG.info("Seeded masakhane, grocery and kagiso");
    }

    private void inTenant(String code, Runnable r) {
        TenantContext.set(code, "SERVICE");
        try {
            tx.executeWithoutResult(t -> r.run());
        } finally {
            TenantContext.clear();
        }
    }

    private void user(String phone, String name) {
        if (users.findOneByLogin(phone).isEmpty()) auth.createUser(phone, name);
    }

    private Member member(String tenant, String code, String name, String ini, String phone, MemberRole role, long amount, MandateStatus st,
        Integer pos, Integer clear, int debitDay, String mandateCreated, String town) {
        String digits = M.digits(phone);
        return members.save(new Member().tenantId(tenant).code(code).name(name).initials(ini).phone(phone)
            .userLogin(digits).role(role).contributionAmount(r(amount)).mandateStatus(st)
            .mandateId(st == MandateStatus.PENDING ? null : "DCK-" + ("grocery".equals(tenant) ? "SGC" : "MDF") + "-" + (4410 + (ini.charAt(0) * 13 + ini.charAt(1)) % 900))
            .mandateCreated(mandateCreated == null ? null : LocalDate.parse(mandateCreated)).queuePosition(pos).projectedClearMonth(clear)
            .debitDay(debitDay).town(town).removed(false));
    }

    private void contribution(Member m, String period, long amount, ContributionStatus st, String collected) {
        contributions.save(new Contribution().tenantId(m.getTenantId()).member(m).period(period).amount(r(amount)).status(st)
            .dueDate(LocalDate.parse(period + "-01")).collectedDate(collected == null ? null : LocalDate.parse(collected)));
    }

    private LedgerEntry entry(String iso, LedgerEntryType type, String desc, String who, long amount, Long failed, String decision, String arc, String reasoning) {
        return ledger.record(type, desc, who, r(amount), failed == null ? null : r(failed), reasoning, decision, arc, at(iso));
    }

    private void decision(String code, String iso, DecisionType type, AgentOutcome outcome, String summary, List<String[]> inputs, String rule,
        String outcomeText, LedgerEntry entry, String arc) {
        decisions.save(new AgentDecision().tenantId(TenantContext.get()).code(code).decidedAt(at(iso)).decisionType(type).outcomeType(outcome)
            .triggerType("SCHEDULED_TICK").summary(summary)
            .inputs(map.inputsJson(inputs.stream().map(kv -> new KeyValueDto().label(kv[0]).value(kv[1])).toList()))
            .ruleApplied(rule).outcome(outcomeText).ledgerEntryCode(entry == null ? null : entry.getCode()).arcTxHash(arc));
    }

    private void masakhane() {
        stokvels.save(new Stokvel().code("masakhane").name("Masakhane Debt Freedom").stokvelType(StokvelType.DEBT_PAYOFF).contributionAmount(r(800))
            .frequency(Frequency.MONTHLY).collectionDay(1).reserveFloor(r(5000)).recyclingEnabled(true).recyclingPercentage(100).recyclingGraceMonths(0)
            .queueOrder("HIGHEST_RATE_FIRST").lendingEnabled(false).startedOn(LocalDate.parse("2026-08-01")).totalMonths(21).plannedMembers(10)
            .autonomous(true).paused(false).createdAt(at("2026-07-25T10:00")));
        Object[][] rows = {
            { "zanele", "Zanele Dlamini", "ZD", "+27 71 402 8813", "Payday loan", 25000, 0, 28, 750, 1, 3 },
            { "thabo", "Thabo Nkosi", "TN", "+27 83 219 6650", "Store card", 42000, 40740, 24, 1260, 2, 7 },
            { "kagiso", "Kagiso Sithole", "KS", "+27 72 884 1027", "Store card", 28000, 27090, 23, 840, 3, 9 },
            { "naledi", "Naledi Mokoena", "NM", "+27 82 555 0147", "Credit card", 38000, 36670, 22, 1140, 4, 12 },
            { "bongani", "Bongani Zulu", "BZ", "+27 61 330 7742", "Store card", 18000, 17370, 22, 540, 5, 13 },
            { "lerato", "Lerato Mahlangu", "LM", "+27 79 615 2208", "Credit card", 30000, 28880, 21, 900, 6, 15 },
            { "sipho", "Sipho Khumalo", "SK", "+27 84 771 0395", "Personal loan", 35000, 33600, 20, 1050, 7, 17 },
            { "mpho", "Mpho Ramaphosa", "MR", "+27 76 508 9461", "Credit card", 22000, 21120, 20, 660, 8, 19 },
            { "palesa", "Palesa Ngwenya", "PN", "+27 73 146 5580", "Credit card", 15000, 14360, 19, 450, 9, 20 },
            { "ayanda", "Ayanda Buthelezi", "AB", "+27 82 903 3374", "Personal loan", 20000, 19100, 18, 600, 10, 21 },
        };
        for (Object[] x : rows) {
            String code = (String) x[0];
            Member m = member("masakhane", code, (String) x[1], (String) x[2], (String) x[3],
                code.equals("naledi") ? MemberRole.TREASURER : MemberRole.MEMBER, 800, MandateStatus.ACTIVE, (Integer) x[9], (Integer) x[10],
                code.equals("zanele") ? 14 : 1, "2026-07-28", code.equals("naledi") ? "Tembisa" : code.equals("bongani") ? "Ivory Park" : null);
            boolean cleared = (Integer) x[6] == 0;
            if (cleared) members.save(m.recycledMinimum(r((Integer) x[8])));
            debts.save(new Debt().tenantId("masakhane").member(m).kind((String) x[4]).creditor((String) x[4]).startBalance(r((Integer) x[5]))
                .balance(r((Integer) x[6])).interestRate(BigDecimal.valueOf((Integer) x[7])).minimumPayment(r((Integer) x[8]))
                .status(cleared ? DebtStatus.CLEARED : DebtStatus.ACTIVE).clearedDate(cleared ? LocalDate.parse("2026-10-09") : null));
            contribution(m, "2026-08", 800, ContributionStatus.COLLECTED, "2026-08-01");
            contribution(m, "2026-09", 800, ContributionStatus.COLLECTED, "2026-09-01");
            contribution(m, "2026-10", 800, code.equals("thabo") ? ContributionStatus.RETRIED : ContributionStatus.COLLECTED,
                code.equals("thabo") ? "2026-10-08" : "2026-10-01");
        }

        entry("2026-08-01T06:00", LedgerEntryType.CONTRIBUTION, "Joining contributions to the reserve", "10 members", 5000, null, null, null, null);
        entry("2026-08-01T06:04", LedgerEntryType.CONTRIBUTION, "August contributions", "10 members", 8000, null, null, null, null);
        var l3 = entry("2026-08-02T09:00", LedgerEntryType.DEBT_PAYMENT, "Paid toward Zanele Dlamini’s payday loan", "Zanele Dlamini", -8000, null, "D-01", null, null);
        entry("2026-09-01T06:03", LedgerEntryType.CONTRIBUTION, "September contributions", "10 members", 8000, null, null, null, null);
        var l5 = entry("2026-09-02T09:00", LedgerEntryType.DEBT_PAYMENT, "Paid toward Zanele Dlamini’s payday loan", "Zanele Dlamini", -8000, null, "D-02", null, null);
        entry("2026-10-01T06:02", LedgerEntryType.CONTRIBUTION, "October contributions, 9 of 10", "9 members", 7200, null, null, null, null);
        var l7 = entry("2026-10-01T06:02", LedgerEntryType.COLLECTION_FAILED, "Thabo Nkosi’s contribution", "Thabo Nkosi", 0, 800L, "D-03", null, "Stitch: insufficient funds. Retry scheduled for 8 Oct.");
        var l8 = entry("2026-10-08T06:01", LedgerEntryType.CONTRIBUTION, "Thabo Nkosi, collected on retry", "Thabo Nkosi", 800, null, "D-05", null, null);
        var l9 = entry("2026-10-09T09:00", LedgerEntryType.DEBT_CLEARED, "Cleared Zanele Dlamini’s payday loan", "Zanele Dlamini", -7250, null, "D-06", null, null);
        var l10 = entry("2026-10-14T06:02", LedgerEntryType.RECYCLED, "Zanele Dlamini’s freed minimum, recycled", "Zanele Dlamini", 750, null, "D-07", null, null);

        decision("D-01", "2026-08-02T09:00", DecisionType.PAYMENT, AgentOutcome.EXECUTE, "Made the first payment: R8,000 toward Zanele’s payday loan.",
            List.of(new String[] { "Pool", "R13,000" }, new String[] { "Reserve floor", "R5,000, from joining contributions" }, new String[] { "Zanele’s balance", "R25,000 at 28%" }),
            "Zanele has the highest rate, so the group pays her debt first. Everything above the reserve floor goes to her lender.", "Paid R8,000 by EFT.", l3, null);
        decision("D-02", "2026-09-02T09:00", DecisionType.PAYMENT, AgentOutcome.EXECUTE, "Paid R8,000 toward Zanele’s payday loan.",
            List.of(new String[] { "Pool", "R13,000" }, new String[] { "Reserve floor", "R5,000" }, new String[] { "Zanele’s balance", "R15,880 at 28%" }),
            "Zanele is first in the queue. Everything above the reserve floor goes to her lender.", "Paid R8,000 by EFT.", l5, null);
        decision("D-03", "2026-10-01T06:05", DecisionType.PAUSE, AgentOutcome.PAUSE, "Paused October’s payout. Thabo Nkosi’s R800 DebiCheck collection failed.",
            List.of(new String[] { "Collected", "9 of 10 · R7,200" }, new String[] { "Thabo Nkosi", "Failed, insufficient funds" }, new String[] { "Stitch retry", "8 Oct" }),
            "A payout only goes out when every contribution for the month is in. I held R7,200 in the pool and sent Thabo a WhatsApp reminder about the retry.",
            "Payout held. Stitch retried on 8 Oct.", l7, null);
        decision("D-04", "2026-10-02T07:00", DecisionType.HOLD, AgentOutcome.NO_ACTION, "Kept the surplus in the queue instead of offering it as a loan.",
            List.of(new String[] { "Stokvel type", "Debt-Payoff" }, new String[] { "Loan requests open", "3" }, new String[] { "Constitution", "Lending off" }),
            "Masakhane’s constitution sends everything above the reserve floor to the payoff queue. Paying a 28% debt beats any loan rate on offer, so I didn’t consider the requests.",
            "No loan offered.", null, null);
        decision("D-05", "2026-10-08T06:01", DecisionType.RESUME, AgentOutcome.NO_ACTION, "Resumed payouts. Thabo’s R800 was collected on retry.",
            List.of(new String[] { "Thabo’s retry", "Collected, 8 Oct 06:01" }, new String[] { "October contributions", "10 of 10" }),
            "Every October contribution is now in, so the pause no longer applies. I scheduled the payout to Zanele’s lender for the next morning.",
            "Payouts resumed.", l8, null);
        decision("D-06", "2026-10-09T09:00", DecisionType.CLEARED, AgentOutcome.EXECUTE, "Cleared Zanele Dlamini’s payday loan at 28%.",
            List.of(new String[] { "Pool", "R13,000" }, new String[] { "Reserve floor", "R5,000" }, new String[] { "Available to pay", "R8,000" }, new String[] { "Zanele’s balance", "R7,250 at 28%" }),
            "Zanele has the highest rate in the queue. R7,250 clears her balance in full and keeps the pool above the reserve floor, so I paid it.",
            "Paid R7,250 to her lender by EFT. On minimums alone she would have paid about R22,880 more in interest. Thabo Nkosi is now first in the queue.", l9, null);
        decision("D-07", "2026-10-14T06:02", DecisionType.RECYCLE, AgentOutcome.EXECUTE, "Recycled R750 from Zanele into the pool. Pool now R6,500.",
            List.of(new String[] { "Zanele’s debt", "Cleared 9 Oct" }, new String[] { "Freed minimum", "R750 a month" }, new String[] { "Recycling rule", "100%, no grace period" }, new String[] { "Her debit date", "The 14th" }),
            "Your constitution says a cleared member’s full minimum goes into the pool from her next debit date. Zanele’s is the 14th, so I collected R750 today.",
            "I added Zanele’s freed R750 minimum to the pool. The 2 Nov payment to Thabo’s store card will be R9,500.", l10, null);

        String[][] inbox = {
            { "2026-10-14T06:02", "Zanele Dlamini’s freed R750 was added to the pool.", "D-07", "RECYCLE", "true" },
            { "2026-10-09T09:00", "Zanele Dlamini is now debt-free. The group cleared her payday loan.", "D-06", "CLEARED", "true" },
            { "2026-10-08T06:01", "Payouts resumed. Thabo Nkosi’s R800 was collected on retry.", "D-05", "RESUME", "false" },
            { "2026-10-01T06:05", "October payout paused. Thabo Nkosi’s DebiCheck collection failed.", "D-03", "PAUSE", "false" },
        };
        for (String[] n : inbox) {
            notifications.save(new Notification().tenantId("masakhane").sentAt(at(n[0])).text(n[1]).decisionCode(n[2])
                .decisionType(DecisionType.valueOf(n[3])).unread(Boolean.parseBoolean(n[4])));
        }
    }

    private void grocery() {
        stokvels.save(new Stokvel().code("grocery").name("Soweto Grocery Club").stokvelType(StokvelType.GROCERY).contributionAmount(r(250))
            .frequency(Frequency.MONTHLY).collectionDay(14).reserveFloor(r(2000)).lendingEnabled(true).lendingCutoffDays(14)
            .payoutDate(LocalDate.parse("2026-11-28")).target(r(33000)).startedOn(LocalDate.parse("2026-02-01")).plannedMembers(12)
            .payoutSchedule("{\"obligations\":[{\"label\":\"Makro deposit\",\"due\":\"2026-11-20\",\"amount\":\"750.00\"}]}")
            .autonomous(false).paused(false).walletAddress(null).createdAt(at("2026-01-20T10:00")));
        String[][] gm = { { "Naledi Mokoena", "NM" }, { "Busisiwe Mthembu", "BM" }, { "Nomsa Khoza", "NK" }, { "Thandeka Mabaso", "TM" },
            { "Lindiwe Shabalala", "LS" }, { "Refilwe Molefe", "RM" }, { "Precious Nxumalo", "PX" }, { "Gugu Ndaba", "GN" }, { "Dimakatso Tau", "DT" },
            { "Nokuthula Cele", "NC" }, { "Sibongile Mokoena", "SM" }, { "Puleng Masilo", "PM" } };
        for (int i = 0; i < gm.length; i++) {
            boolean me = i == 0, failed = gm[i][0].equals("Busisiwe Mthembu");
            String phone = me ? "+27 82 555 0147" : "+27 7" + (2 + i % 7) + " " + (310 + i * 37) + " " + String.format("%04d", (1000 + i * 611) % 9000);
            Member m = member("grocery", me ? "naledi" : "g" + i, gm[i][0], gm[i][1], phone, me ? MemberRole.TREASURER : MemberRole.MEMBER, 250,
                failed ? MandateStatus.FAILED : MandateStatus.ACTIVE, i + 1, null, 14, "2026-02-03", me ? "Tembisa" : null);
            for (String p : List.of("2026-05", "2026-06", "2026-07", "2026-08", "2026-09")) contribution(m, p, 250, ContributionStatus.COLLECTED, p + "-14");
            contribution(m, "2026-10", 250, failed ? ContributionStatus.FAILED : ContributionStatus.COLLECTED, failed ? null : "2026-10-14");
        }
        entry("2026-09-01T06:00", LedgerEntryType.CONTRIBUTION, "Balance brought forward, February to August", "12 members", 16750, null, null, null, null);
        entry("2026-09-28T06:00", LedgerEntryType.CONTRIBUTION, "September contributions", "12 members", 3000, null, null, null, null);
        var lend = entry("2026-10-02T11:20", LedgerEntryType.LOAN_OUT, "You lent to Tembisa Burial Society", "Tembisa Burial Society", -4000, null, "G-02",
            "0x7a3f9c2e41d8b6a05f3e7c1d9b2a4e6f8c0d1e3f5a7b9c1d3e5f7a9b1c3d5e7f91e", "Repayment due 2 Nov, before the 28 Nov payout.");
        var declined = entry("2026-10-11T14:05", LedgerEntryType.LOAN_DECLINED, "Declined Mamelodi Rotational Circle", "Mamelodi Rotational Circle", 0, null, "G-03", null,
            "Tier C: two missed contributions in six months.");
        entry("2026-10-14T06:00", LedgerEntryType.CONTRIBUTION, "October contributions, 11 of 12", "11 members", 2750, null, null, null, null);
        entry("2026-10-14T06:00", LedgerEntryType.COLLECTION_FAILED, "Busisiwe Mthembu’s contribution", "Busisiwe Mthembu", 0, 250L, null, null, "Stitch retries on 21 Oct.");

        decision("G-01", "2026-10-02T08:40", DecisionType.ASSESS, AgentOutcome.PROPOSE, "Assessed Tembisa Burial Society as Tier B.",
            List.of(new String[] { "Tenure", "26 months" }, new String[] { "Members", "15" }, new String[] { "On-time contributions", "11 of 12 months" }, new String[] { "Prior loans", "2, no defaults" }),
            "One late month this year keeps them out of Tier A, but they’ve repaid every loan. Tier B, with a 30-day term.", "Sent you the request to review.", null, null);
        decision("G-02", "2026-10-02T11:20", DecisionType.LEND, AgentOutcome.EXECUTE, "Lent R4,000 to Tembisa Burial Society for 30 days.",
            List.of(new String[] { "Pool", "R22,750" }, new String[] { "Reserve floor", "R2,000" }, new String[] { "Next payout", "28 Nov" }, new String[] { "Request", "R4,000 · 30 days · 22% · Tier B" }),
            "Repayment is due 2 Nov, 26 days before your payout, and the pool stays above the reserve floor the whole time. You approved it at 11:18.",
            "I lent R4,000 to Tembisa Burial Society for 30 days. Your pool stays above the R2,000 reserve until it’s repaid on 2 Nov, well before the payout.",
            lend, lend.getArcTxHash());
        decision("G-03", "2026-10-11T14:05", DecisionType.DECLINE, AgentOutcome.NO_ACTION, "Declined Mamelodi Rotational Circle’s R6,000 request.",
            List.of(new String[] { "Request", "R6,000 · 45 days · 20%" }, new String[] { "Their record", "2 missed contributions in 6 months" }, new String[] { "Tenure", "7 months" }),
            "Two missed months in the last six puts them in Tier C. Your constitution only lends to Tier A and B stokvels.",
            "Request declined with reason. They can ask again after 3 clean months.", declined, null);

        loans.save(new Loan().tenantId("grocery").code("LN-07").direction(LoanDirection.OUT).counterparty("Tembisa Burial Society").principal(r(4000))
            .ratePct(BigDecimal.valueOf(22)).termDays(30).repaid(r(0)).totalDue(r(4072)).dueDate(LocalDate.parse("2026-11-02")).status(LoanStatus.ON_TRACK)
            .escrowJobId("8183-job-0007").escrowStatus(EscrowStatus.FUNDED).arcTxHash(lend.getArcTxHash()).disbursedAt(at("2026-10-02T11:20")));
        loans.save(new Loan().tenantId("grocery").code("LN-05").direction(LoanDirection.OUT).counterparty("Orlando Rotational Club").principal(r(2500))
            .ratePct(BigDecimal.valueOf(18)).termDays(90).repaid(r(1700)).totalDue(r(2611)).dueDate(LocalDate.parse("2026-11-14")).status(LoanStatus.ON_TRACK)
            .escrowJobId("8183-job-0005").escrowStatus(EscrowStatus.FUNDED).disbursedAt(at("2026-08-16T10:00")));
        loans.save(new Loan().tenantId("grocery").code("LN-02").direction(LoanDirection.IN).counterparty("Meadowlands Investment Club").principal(r(3000))
            .ratePct(BigDecimal.valueOf(15)).termDays(60).repaid(r(2000)).totalDue(r(3074)).dueDate(LocalDate.parse("2026-10-25")).status(LoanStatus.DUE_SOON)
            .escrowJobId("8183-job-0002").escrowStatus(EscrowStatus.FUNDED).disbursedAt(at("2026-08-26T09:00")));

        request("REQ-31", "Diepkloof Grocery Society", StokvelType.GROCERY, 12, 18, 8000, 30, 18, "2026-11-16", 118, "0x4b1e9a…72d0", CreditTier.A, true,
            "18 months active, 12 members, 0 missed contributions.", "Bulk grocery buy for December, ordered early to lock in the November price.",
            "oooooooooooo", 3, 0, 4200, 2000,
            "Diepkloof Grocery Society has contributed on time for 18 straight months across 12 members. They’ve repaid all three prior loans without default, and their reserve sits at twice its floor. Repayment is due 16 Nov, 12 days before your payout. I’d approve at 18%.");
        request("REQ-32", "Kagiso Investment Collective", StokvelType.INVESTMENT, 8, 24, 15000, 90, 16, "2027-01-15", 592, "0x91c07d…e3a4", CreditTier.A, false,
            "24 months active, 8 members, 0 missed contributions.", "Deposit on a second-hand minibus taxi for a Tembisa route.", "oooooooooooo", 1, 0, 9600, 6000,
            "Their record is as strong as it gets: 24 months, no missed contributions, one loan repaid early. But 90 days runs to 15 Jan, past your 28 Nov payout, and R15,000 is nearly everything you can lend. I’d decline this term and offer 30 days instead.");
        request("REQ-33", "Alexandra Burial Society", StokvelType.BURIAL, 15, 26, 3000, 30, 22, "2026-11-16", 54, "0x5d22f0…19bc", CreditTier.B, true,
            "26 months active, 15 members, 1 late month this year.", "Cover a member’s funeral while a policy claim is processed.", "oooooolooooo", 2, 0, 2600, 2500,
            "One late month in April keeps them out of Tier A, and their reserve is only just above its floor. But they’ve repaid both prior loans, the amount is small, and repayment lands 12 days before your payout. I’d approve at 22% to reflect the thinner reserve.");

        notifications.save(new Notification().tenantId("grocery").sentAt(at("2026-10-14T06:00")).unread(true)
            .text("Busisiwe Mthembu’s R250 wasn’t collected on 14 Oct. Stitch retries on 21 Oct."));
    }

    private void request(String code, String name, StokvelType type, int members, int months, long amount, int days, int rate, String due, long interest,
        String escrow, CreditTier tier, boolean recommend, String note, String purpose, String record, int priorLoans, int defaults, long resBal, long resFloor,
        String reasoning) {
        requests.save(new LoanRequest().tenantId("grocery").code(code).borrowerCode(name.toLowerCase().replaceAll("[^a-z]+", "-")).borrowerName(name)
            .borrowerType(type).borrowerMembers(members).monthsActive(months).contributionRecord(record).priorLoans(priorLoans).priorDefaults(defaults)
            .reserveBalance(r(resBal)).borrowerReserveFloor(r(resFloor)).amount(r(amount)).termDays(days).ratePct(BigDecimal.valueOf(rate)).purpose(purpose)
            .dueDate(LocalDate.parse(due)).interest(r(interest)).escrowAddress(escrow).status(LoanRequestStatus.OPEN).tier(tier).recommend(recommend)
            .reasoning(reasoning).note(note).createdAt(at("2026-10-15T09:00")));
    }

    private void kagiso() {
        stokvels.save(new Stokvel().code("kagiso").name("Kagiso Investment Collective").stokvelType(StokvelType.INVESTMENT).contributionAmount(r(1500))
            .frequency(Frequency.MONTHLY).collectionDay(1).reserveFloor(r(6000)).lendingEnabled(true).plannedMembers(8).autonomous(false).paused(false)
            .startedOn(LocalDate.parse("2024-10-01")).createdAt(at("2024-09-20T10:00")));
        // Naledi has been invited but hasn't approved the mandate yet.
        member("kagiso", "naledi", "Naledi Mokoena", "NM", "+27 82 555 0147", MemberRole.MEMBER, 1500, MandateStatus.PENDING, 8, null, 1, null, "Tembisa");
    }
}
