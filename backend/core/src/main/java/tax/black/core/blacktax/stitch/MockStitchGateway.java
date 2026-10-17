package tax.black.core.blacktax.stitch;

import java.math.BigDecimal;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import tax.black.core.blacktax.Settings;
import tax.black.core.domain.Member;

/**
 * Local rail (system design §6 "Mock Stitch"). Behaves like the sandbox: a collection succeeds a moment later and
 * the result is delivered as a real, signed HTTP webhook to /api/webhooks/stitch, so the production code path runs.
 */
@Component
@ConditionalOnProperty(name = "blacktax.stitch.mode", havingValue = "mock", matchIfMissing = true)
public class MockStitchGateway implements StitchGateway {

    private final StitchWebhookSender sender;
    private final Settings settings;

    public MockStitchGateway(StitchWebhookSender sender, Settings settings) {
        this.sender = sender;
        this.settings = settings;
    }

    @Override
    public String requestMandate(String stokvelId, Member member, BigDecimal amount) {
        return settings.publicUrl + "/mock-stitch/debicheck/" + stokvelId + ":" + member.getCode();
    }

    @Override
    public String initiateCollection(String stokvelId, Member member, BigDecimal amount, String period) {
        String paymentId = "pay_" + UUID.randomUUID().toString().substring(0, 12);
        CompletableFuture.delayedExecutor(1500, TimeUnit.MILLISECONDS).execute(() ->
            sender.deliver("PAYMENT_SUCCEEDED", member.getMandateId(), paymentId, stokvelId + ":" + member.getCode() + ":" + period, amount, null)
        );
        return paymentId;
    }
}
