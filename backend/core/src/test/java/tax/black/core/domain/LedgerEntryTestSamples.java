package tax.black.core.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class LedgerEntryTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    public static LedgerEntry getLedgerEntrySample1() {
        return new LedgerEntry()
            .id(1L)
            .tenantId("tenantId1")
            .code("code1")
            .counterparty("counterparty1")
            .description("description1")
            .decisionCode("decisionCode1")
            .arcTxHash("arcTxHash1")
            .beancountHash("beancountHash1");
    }

    public static LedgerEntry getLedgerEntrySample2() {
        return new LedgerEntry()
            .id(2L)
            .tenantId("tenantId2")
            .code("code2")
            .counterparty("counterparty2")
            .description("description2")
            .decisionCode("decisionCode2")
            .arcTxHash("arcTxHash2")
            .beancountHash("beancountHash2");
    }

    public static LedgerEntry getLedgerEntryRandomSampleGenerator() {
        return new LedgerEntry()
            .id(longCount.incrementAndGet())
            .tenantId(UUID.randomUUID().toString())
            .code(UUID.randomUUID().toString())
            .counterparty(UUID.randomUUID().toString())
            .description(UUID.randomUUID().toString())
            .decisionCode(UUID.randomUUID().toString())
            .arcTxHash(UUID.randomUUID().toString())
            .beancountHash(UUID.randomUUID().toString());
    }
}
