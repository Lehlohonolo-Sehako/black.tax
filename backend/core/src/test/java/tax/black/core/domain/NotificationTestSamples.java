package tax.black.core.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class NotificationTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    public static Notification getNotificationSample1() {
        return new Notification().id(1L).tenantId("tenantId1").text("text1").decisionCode("decisionCode1");
    }

    public static Notification getNotificationSample2() {
        return new Notification().id(2L).tenantId("tenantId2").text("text2").decisionCode("decisionCode2");
    }

    public static Notification getNotificationRandomSampleGenerator() {
        return new Notification()
            .id(longCount.incrementAndGet())
            .tenantId(UUID.randomUUID().toString())
            .text(UUID.randomUUID().toString())
            .decisionCode(UUID.randomUUID().toString());
    }
}
