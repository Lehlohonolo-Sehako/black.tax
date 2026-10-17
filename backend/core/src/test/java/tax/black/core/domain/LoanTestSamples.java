package tax.black.core.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class LoanTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Loan getLoanSample1() {
        return new Loan()
            .id(1L)
            .tenantId("tenantId1")
            .code("code1")
            .counterparty("counterparty1")
            .termDays(1)
            .escrowJobId("escrowJobId1")
            .arcTxHash("arcTxHash1");
    }

    public static Loan getLoanSample2() {
        return new Loan()
            .id(2L)
            .tenantId("tenantId2")
            .code("code2")
            .counterparty("counterparty2")
            .termDays(2)
            .escrowJobId("escrowJobId2")
            .arcTxHash("arcTxHash2");
    }

    public static Loan getLoanRandomSampleGenerator() {
        return new Loan()
            .id(longCount.incrementAndGet())
            .tenantId(UUID.randomUUID().toString())
            .code(UUID.randomUUID().toString())
            .counterparty(UUID.randomUUID().toString())
            .termDays(intCount.incrementAndGet())
            .escrowJobId(UUID.randomUUID().toString())
            .arcTxHash(UUID.randomUUID().toString());
    }
}
