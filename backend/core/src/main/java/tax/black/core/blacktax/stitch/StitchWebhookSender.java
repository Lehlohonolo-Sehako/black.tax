package tax.black.core.blacktax.stitch;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import tax.black.core.blacktax.M;
import tax.black.core.blacktax.Settings;
import tools.jackson.databind.ObjectMapper;

/** Signs and delivers Stitch-shaped events to this service's own webhook, as the sandbox would. Mock rail and dev only. */
@Component
public class StitchWebhookSender {

    private static final Logger LOG = LoggerFactory.getLogger(StitchWebhookSender.class);
    private final Settings settings;
    private final ObjectMapper json;
    private final RestClient self;

    public StitchWebhookSender(Settings settings, ObjectMapper json, @Value("${server.port:8080}") int port) {
        this.settings = settings;
        this.json = json;
        this.self = RestClient.builder().baseUrl("http://localhost:" + port).build();
    }

    public void deliver(String type, String mandateId, String paymentId, String externalReference, BigDecimal amount, String reason) {
        Map<String, Object> data = new LinkedHashMap<>();
        if (mandateId != null) data.put("mandateId", mandateId);
        if (paymentId != null) data.put("paymentId", paymentId);
        data.put("externalReference", externalReference);
        if (amount != null) data.put("amount", M.s(amount));
        if (reason != null) data.put("reason", reason);
        Map<String, Object> event = new LinkedHashMap<>();
        event.put("id", "evt_" + UUID.randomUUID());
        event.put("type", type);
        event.put("createdAt", OffsetDateTime.now(M.SAST).toString());
        event.put("data", data);
        byte[] body = json.writeValueAsString(event).getBytes(StandardCharsets.UTF_8);
        String sig = StitchSignature.sign(settings.stitchWebhookSecret, Instant.now().getEpochSecond(), body);
        try {
            self.post().uri("/api/webhooks/stitch").contentType(MediaType.APPLICATION_JSON).header("X-Stitch-Signature", sig)
                .body(body).retrieve().toBodilessEntity();
        } catch (RuntimeException e) {
            LOG.warn("Stitch webhook delivery failed for {}: {}", externalReference, e.getMessage());
        }
    }
}
