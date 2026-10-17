package tax.black.core.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class StokvelTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Stokvel getStokvelSample1() {
        return new Stokvel()
            .id(1L)
            .code("code1")
            .name("name1")
            .collectionDay(1)
            .recyclingPercentage(1)
            .recyclingGraceMonths(1)
            .queueOrder("queueOrder1")
            .lendingCutoffDays(1)
            .totalMonths(1)
            .plannedMembers(1)
            .walletAddress("walletAddress1");
    }

    public static Stokvel getStokvelSample2() {
        return new Stokvel()
            .id(2L)
            .code("code2")
            .name("name2")
            .collectionDay(2)
            .recyclingPercentage(2)
            .recyclingGraceMonths(2)
            .queueOrder("queueOrder2")
            .lendingCutoffDays(2)
            .totalMonths(2)
            .plannedMembers(2)
            .walletAddress("walletAddress2");
    }

    public static Stokvel getStokvelRandomSampleGenerator() {
        return new Stokvel()
            .id(longCount.incrementAndGet())
            .code(UUID.randomUUID().toString())
            .name(UUID.randomUUID().toString())
            .collectionDay(intCount.incrementAndGet())
            .recyclingPercentage(intCount.incrementAndGet())
            .recyclingGraceMonths(intCount.incrementAndGet())
            .queueOrder(UUID.randomUUID().toString())
            .lendingCutoffDays(intCount.incrementAndGet())
            .totalMonths(intCount.incrementAndGet())
            .plannedMembers(intCount.incrementAndGet())
            .walletAddress(UUID.randomUUID().toString());
    }
}
