package tax.black.core.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static tax.black.core.domain.AgentDecisionTestSamples.*;

import org.junit.jupiter.api.Test;
import tax.black.core.web.rest.TestUtil;

class AgentDecisionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AgentDecision.class);
        AgentDecision agentDecision1 = getAgentDecisionSample1();
        AgentDecision agentDecision2 = new AgentDecision();
        assertThat(agentDecision1).isNotEqualTo(agentDecision2);

        agentDecision2.setId(agentDecision1.getId());
        assertThat(agentDecision1).isEqualTo(agentDecision2);

        agentDecision2 = getAgentDecisionSample2();
        assertThat(agentDecision1).isNotEqualTo(agentDecision2);
    }
}
