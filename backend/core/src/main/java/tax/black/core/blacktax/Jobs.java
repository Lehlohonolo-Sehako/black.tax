package tax.black.core.blacktax;

import java.time.Clock;
import java.time.LocalDate;
import java.time.YearMonth;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionTemplate;
import tax.black.core.blacktax.stitch.StitchGateway;
import tax.black.core.domain.Contribution;
import tax.black.core.domain.Member;
import tax.black.core.domain.Stokvel;
import tax.black.core.domain.enumeration.ContributionStatus;
import tax.black.core.domain.enumeration.MandateStatus;
import tax.black.core.repository.ContributionRepository;
import tax.black.core.repository.StokvelRepository;
import tax.black.core.tenancy.TenantContext;

/** Daily jobs (system design §2.1). Each runs per stokvel inside that stokvel's tenant scope. */
@Component
public class Jobs {

    private static final Logger LOG = LoggerFactory.getLogger(Jobs.class);
    private final StokvelRepository stokvels;
    private final ContributionRepository contributions;
    private final Tenant tenant;
    private final StitchGateway stitch;
    private final AgentClient agent;
    private final TransactionTemplate tx;
    private final Clock clock;

    public Jobs(StokvelRepository stokvels, ContributionRepository contributions, Tenant tenant, StitchGateway stitch, AgentClient agent,
        TransactionTemplate tx, Clock clock) {
        this.stokvels = stokvels;
        this.contributions = contributions;
        this.tenant = tenant;
        this.stitch = stitch;
        this.agent = agent;
        this.tx = tx;
        this.clock = clock;
    }

    /** 06:00 SAST: start DebiCheck collections that fall due today. Results arrive as Stitch webhooks. */
    @Scheduled(cron = "${blacktax.jobs.collection-cron:0 0 6 * * *}", zone = "Africa/Johannesburg")
    public void collectDueContributions() {
        LocalDate today = LocalDate.now(clock.withZone(M.SAST));
        for (Stokvel s : stokvels.findAll()) {
            TenantContext.set(s.getCode(), "SERVICE");
            try {
                tx.executeWithoutResult(t -> {
                    String period = YearMonth.from(today).toString();
                    for (Member m : tenant.members()) {
                        int day = m.getDebitDay() != null ? m.getDebitDay() : s.getCollectionDay() == null ? 1 : s.getCollectionDay();
                        if (m.getMandateStatus() != MandateStatus.ACTIVE || day != today.getDayOfMonth()) continue;
                        if (contributions.findOneByMemberCodeAndPeriod(m.getCode(), period).isPresent()) continue;
                        contributions.save(new Contribution().tenantId(s.getCode()).member(m).period(period).amount(m.getContributionAmount())
                            .dueDate(today).status(ContributionStatus.PENDING));
                        stitch.initiateCollection(s.getCode(), m, m.getContributionAmount(), period);
                    }
                });
            } catch (RuntimeException e) {
                LOG.warn("Collection run failed for {}: {}", s.getCode(), e.getMessage());
            } finally {
                TenantContext.clear();
            }
        }
    }

    /** 07:00 SAST: the agent's daily tick for every stokvel. */
    @Scheduled(cron = "${blacktax.jobs.agent-cron:0 0 7 * * *}", zone = "Africa/Johannesburg")
    public void agentTick() {
        for (Stokvel s : stokvels.findAll()) {
            try {
                agent.evaluate(s.getCode(), "SCHEDULED_TICK");
            } catch (RuntimeException e) {
                LOG.warn("Agent tick failed for {}: {}", s.getCode(), e.getMessage());
            }
        }
    }
}
