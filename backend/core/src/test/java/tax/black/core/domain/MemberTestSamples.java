package tax.black.core.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class MemberTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Member getMemberSample1() {
        return new Member()
            .id(1L)
            .tenantId("tenantId1")
            .code("code1")
            .userLogin("userLogin1")
            .name("name1")
            .initials("initials1")
            .phone("phone1")
            .town("town1")
            .mandateId("mandateId1")
            .queuePosition(1)
            .projectedClearMonth(1)
            .debitDay(1);
    }

    public static Member getMemberSample2() {
        return new Member()
            .id(2L)
            .tenantId("tenantId2")
            .code("code2")
            .userLogin("userLogin2")
            .name("name2")
            .initials("initials2")
            .phone("phone2")
            .town("town2")
            .mandateId("mandateId2")
            .queuePosition(2)
            .projectedClearMonth(2)
            .debitDay(2);
    }

    public static Member getMemberRandomSampleGenerator() {
        return new Member()
            .id(longCount.incrementAndGet())
            .tenantId(UUID.randomUUID().toString())
            .code(UUID.randomUUID().toString())
            .userLogin(UUID.randomUUID().toString())
            .name(UUID.randomUUID().toString())
            .initials(UUID.randomUUID().toString())
            .phone(UUID.randomUUID().toString())
            .town(UUID.randomUUID().toString())
            .mandateId(UUID.randomUUID().toString())
            .queuePosition(intCount.incrementAndGet())
            .projectedClearMonth(intCount.incrementAndGet())
            .debitDay(intCount.incrementAndGet());
    }
}
