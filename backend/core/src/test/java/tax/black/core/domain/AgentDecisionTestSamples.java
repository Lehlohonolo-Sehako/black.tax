package tax.black.core.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class AgentDecisionTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    public static AgentDecision getAgentDecisionSample1() {
        return new AgentDecision()
            .id(1L)
            .tenantId("tenantId1")
            .code("code1")
            .triggerType("triggerType1")
            .summary("summary1")
            .ledgerEntryCode("ledgerEntryCode1")
            .arcTxHash("arcTxHash1");
    }

    public static AgentDecision getAgentDecisionSample2() {
        return new AgentDecision()
            .id(2L)
            .tenantId("tenantId2")
            .code("code2")
            .triggerType("triggerType2")
            .summary("summary2")
            .ledgerEntryCode("ledgerEntryCode2")
            .arcTxHash("arcTxHash2");
    }

    public static AgentDecision getAgentDecisionRandomSampleGenerator() {
        return new AgentDecision()
            .id(longCount.incrementAndGet())
            .tenantId(UUID.randomUUID().toString())
            .code(UUID.randomUUID().toString())
            .triggerType(UUID.randomUUID().toString())
            .summary(UUID.randomUUID().toString())
            .ledgerEntryCode(UUID.randomUUID().toString())
            .arcTxHash(UUID.randomUUID().toString());
    }
}
