package tax.black.core.web.delegate;

import java.time.OffsetDateTime;
import java.time.YearMonth;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tax.black.core.blacktax.DecisionService;
import tax.black.core.blacktax.LedgerService;
import tax.black.core.blacktax.M;
import tax.black.core.blacktax.Mappers;
import tax.black.core.blacktax.Tenant;
import tax.black.core.domain.AgentDecision;
import tax.black.core.repository.AgentDecisionRepository;
import tax.black.core.repository.ContributionRepository;
import tax.black.core.service.api.dto.*;
import tax.black.core.web.api.InternalApiDelegate;

/** The agent's read and write path into core. Service-token only (see TenantAccessInterceptor). */
@Service
public class InternalDelegate implements InternalApiDelegate {

    private final Tenant tenant;
    private final Mappers map;
    private final ContributionRepository contributions;
    private final AgentDecisionRepository decisions;
    private final LedgerService ledger;
    private final DecisionService decisionService;
    private final java.time.Clock clock;

    public InternalDelegate(Tenant tenant, Mappers map, ContributionRepository contributions, AgentDecisionRepository decisions,
        LedgerService ledger, DecisionService decisionService, java.time.Clock clock) {
        this.tenant = tenant;
        this.map = map;
        this.contributions = contributions;
        this.decisions = decisions;
        this.ledger = ledger;
        this.decisionService = decisionService;
        this.clock = clock;
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<AgentStateDto> getAgentState(String stokvelId) {
        var s = tenant.stokvel();
        var members = tenant.members();
        String period = YearMonth.now(clock.withZone(M.SAST)).toString();
        var state = new AgentStateDto()
            .asOf(OffsetDateTime.now(clock.withZone(M.SAST)))
            .stokvel(map.stokvel(s, members.size()))
            .members(map.roster(members, tenant.debtsByMember()))
            .poolBalance(M.s(ledger.balance()))
            .paused(Boolean.TRUE.equals(s.getPaused()))
            .lastDecisionId(decisions.findFirstByOrderByDecidedAtDescIdDesc().map(AgentDecision::getCode).orElse(null));
        for (var c : contributions.findByPeriod(period)) {
            var dto = map.contribution(c);
            var inner = new AgentStateContributionsInnerDto().id(dto.getId()).period(dto.getPeriod()).amount(dto.getAmount())
                .dueDate(dto.getDueDate()).collectedDate(dto.getCollectedDate()).status(dto.getStatus()).stitchPaymentId(dto.getStitchPaymentId())
                .memberId(c.getMember().getCode());
            state.addContributionsItem(inner);
        }
        return ResponseEntity.ok(state);
    }

    @Override
    public ResponseEntity<AgentDecisionDto> recordDecision(String stokvelId, RecordDecisionRequestDto req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(decisionService.record(req));
    }
}
