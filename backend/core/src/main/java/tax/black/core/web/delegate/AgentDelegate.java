package tax.black.core.web.delegate;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import tax.black.core.blacktax.AgentClient;
import tax.black.core.blacktax.DecisionService;
import tax.black.core.blacktax.Mappers;
import tax.black.core.blacktax.Tenant;
import tax.black.core.domain.enumeration.MemberRole;
import tax.black.core.repository.AgentDecisionRepository;
import tax.black.core.service.api.dto.*;
import tax.black.core.tenancy.TenantAccessInterceptor;
import tax.black.core.web.api.AgentApiDelegate;

@Service
public class AgentDelegate implements AgentApiDelegate {

    private final AgentDecisionRepository decisions;
    private final DecisionService decisionService;
    private final AgentClient agent;
    private final Mappers map;
    private final Tenant tenant;

    public AgentDelegate(AgentDecisionRepository decisions, DecisionService decisionService, AgentClient agent, Mappers map, Tenant tenant) {
        this.decisions = decisions;
        this.decisionService = decisionService;
        this.agent = agent;
        this.map = map;
        this.tenant = tenant;
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<List<AgentDecisionDto>> listDecisions(String stokvelId, DecisionFilterDto filter, OffsetDateTime since) {
        return ResponseEntity.ok(decisions.findAllByOrderByDecidedAtDescIdDesc().stream()
            .filter(d -> since == null || !d.getDecidedAt().isBefore(since.toInstant()))
            .filter(d -> filter == null || Mappers.filterOf(d.getDecisionType()) == filter)
            .map(map::decision).toList());
    }

    @Override
    public ResponseEntity<AgentEvaluationDto> runAgent(String stokvelId) {
        TenantAccessInterceptor.requireTreasurer();
        return ResponseEntity.ok(evaluation(callAgent(() -> agent.evaluate(stokvelId, "MANUAL"))));
    }

    @Override
    @Transactional
    public ResponseEntity<AgentDecisionDto> resumeAgent(String stokvelId) {
        TenantAccessInterceptor.requireTreasurer();
        String name = tenant.members().stream().filter(m -> m.getRole() == MemberRole.TREASURER).map(m -> m.getName()).findFirst().orElse("Treasurer");
        return ResponseEntity.ok(decisionService.treasurerResume(name));
    }

    static Map<String, Object> callAgent(java.util.function.Supplier<Map<String, Object>> call) {
        try {
            return call.get();
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            // The agent validated the request and refused it: that's the caller's data, not an outage.
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_CONTENT, "The agent refused this request. Nothing moved.", e);
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "The agent service didn’t answer. Nothing moved.", e);
        }
    }

    @SuppressWarnings("unchecked")
    static AgentEvaluationDto evaluation(Map<String, Object> r) {
        var dto = new AgentEvaluationDto()
            .decision(AgentOutcomeDto.fromValue((String) r.get("decision")))
            .reasoning((String) r.get("reasoning"))
            .decisionId((String) r.get("decision_id"));
        for (Map<String, Object> a : (List<Map<String, Object>>) r.getOrDefault("actions", List.of())) {
            dto.addActionsItem(new AgentActionDto().type(AgentActionDto.TypeEnum.fromValue((String) a.get("type")))
                .memberId((String) a.get("member_id")).jobId((String) a.get("job_id")).amount((String) a.get("amount")).txHash((String) a.get("tx_hash")));
        }
        return dto;
    }
}
