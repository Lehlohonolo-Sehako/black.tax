package tax.black.core.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class DebtTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    public static Debt getDebtSample1() {
        return new Debt().id(1L).tenantId("tenantId1").creditor("creditor1").kind("kind1");
    }

    public static Debt getDebtSample2() {
        return new Debt().id(2L).tenantId("tenantId2").creditor("creditor2").kind("kind2");
    }

    public static Debt getDebtRandomSampleGenerator() {
        return new Debt()
            .id(longCount.incrementAndGet())
            .tenantId(UUID.randomUUID().toString())
            .creditor(UUID.randomUUID().toString())
            .kind(UUID.randomUUID().toString());
    }
}
