package tax.black.core.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ContributionTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    public static Contribution getContributionSample1() {
        return new Contribution().id(1L).tenantId("tenantId1").period("period1").stitchPaymentId("stitchPaymentId1");
    }

    public static Contribution getContributionSample2() {
        return new Contribution().id(2L).tenantId("tenantId2").period("period2").stitchPaymentId("stitchPaymentId2");
    }

    public static Contribution getContributionRandomSampleGenerator() {
        return new Contribution()
            .id(longCount.incrementAndGet())
            .tenantId(UUID.randomUUID().toString())
            .period(UUID.randomUUID().toString())
            .stitchPaymentId(UUID.randomUUID().toString());
    }
}
