package tax.black.core.blacktax.stitch;

import java.time.Clock;
import java.time.LocalDate;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import tax.black.core.blacktax.LedgerService;
import tax.black.core.blacktax.M;
import tax.black.core.blacktax.Tenant;
import tax.black.core.domain.Contribution;
import tax.black.core.domain.Member;
import tax.black.core.domain.Notification;
import tax.black.core.domain.enumeration.ContributionStatus;
import tax.black.core.domain.enumeration.LedgerEntryType;
import tax.black.core.domain.enumeration.MandateStatus;
import tax.black.core.repository.ContributionRepository;
import tax.black.core.repository.MemberRepository;
import tax.black.core.repository.NotificationRepository;
import tax.black.core.service.api.dto.StitchEventDto;

/**
 * Applies a verified Stitch event. Returns the stokvel id when the agent should re-evaluate (a collection result or
 * a mandate failure), so the caller can trigger it after this transaction commits.
 */
@Service
public class StitchEventService {

    private final Set<String> processed = ConcurrentHashMap.newKeySet();
    private final Tenant tenant;
    private final MemberRepository members;
    private final ContributionRepository contributions;
    private final NotificationRepository notifications;
    private final LedgerService ledger;
    private final Clock clock;

    public StitchEventService(Tenant tenant, MemberRepository members, ContributionRepository contributions,
        NotificationRepository notifications, LedgerService ledger, Clock clock) {
        this.tenant = tenant;
        this.members = members;
        this.contributions = contributions;
        this.notifications = notifications;
        this.ledger = ledger;
        this.clock = clock;
    }

    /** Idempotent on event id. Must run with TenantContext already set to the event's stokvel. */
    @Transactional
    public boolean handle(StitchEventDto event, String memberCode, String period) {
        if (processed.contains(event.getId())) return false;
        // Mark processed only once this transaction commits: a rollback (e.g. ledger down) must let Stitch's retry through.
        String eventId = event.getId();
        org.springframework.transaction.support.TransactionSynchronizationManager.registerSynchronization(
            new org.springframework.transaction.support.TransactionSynchronization() {
                @Override
                public void afterCommit() {
                    processed.add(eventId);
                }
            });
        Member m = tenant.member(memberCode);
        var data = event.getData();
        LocalDate today = LocalDate.now(clock.withZone(M.SAST));
        switch (event.getType()) {
            case MANDATE_AUTHENTICATED -> {
                m.mandateStatus(MandateStatus.ACTIVE).mandateId(data.getMandateId()).mandateCreated(today);
                members.save(m);
                return false;
            }
            case MANDATE_FAILED, MANDATE_CANCELLED -> {
                m.mandateStatus(MandateStatus.FAILED);
                members.save(m);
                notifications.save(new Notification().tenantId(tenant.id()).sentAt(clock.instant()).unread(true)
                    .text(m.getName() + "’s DebiCheck mandate was cancelled by their bank."));
                return true;
            }
            case PAYMENT_SUCCEEDED, PAYMENT_FAILED -> {
                if (period == null) throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_CONTENT, "externalReference needs a period");
                boolean ok = event.getType() == StitchEventDto.TypeEnum.PAYMENT_SUCCEEDED;
                var amount = data.getAmount() != null ? M.d(data.getAmount()) : m.getContributionAmount();
                Contribution c = contributions.findOneByMemberCodeAndPeriod(memberCode, period).orElseGet(() ->
                    new Contribution().tenantId(tenant.id()).member(m).period(period).amount(amount).status(ContributionStatus.PENDING));
                boolean retry = c.getStatus() == ContributionStatus.FAILED;
                c.stitchPaymentId(data.getPaymentId());
                if (ok) {
                    c.status(retry ? ContributionStatus.RETRIED : ContributionStatus.COLLECTED).collectedDate(today);
                    contributions.save(c);
                    boolean recycled = m.getRecycledMinimum() != null && amount.compareTo(m.getRecycledMinimum()) == 0
                        && amount.compareTo(m.getContributionAmount()) != 0;
                    ledger.record(recycled ? LedgerEntryType.RECYCLED : LedgerEntryType.CONTRIBUTION,
                        recycled ? m.getName() + "’s freed minimum, recycled" : m.getName() + (retry ? ", collected on retry" : ", " + period + " contribution"),
                        m.getName(), amount, null, null, null, null, clock.instant());
                } else {
                    c.status(ContributionStatus.FAILED);
                    contributions.save(c);
                    ledger.record(LedgerEntryType.COLLECTION_FAILED, m.getName() + "’s contribution", m.getName(), M.ZERO, amount,
                        data.getReason(), null, null, clock.instant());
                }
                return true;
            }
            default -> {
                return false;
            }
        }
    }
}
