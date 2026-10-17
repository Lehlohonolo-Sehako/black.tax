package tax.black.core.web.delegate;

import java.time.Instant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import tax.black.core.blacktax.AgentClient;
import tax.black.core.blacktax.Settings;
import tax.black.core.blacktax.stitch.StitchEventService;
import tax.black.core.blacktax.stitch.StitchSignature;
import tax.black.core.service.api.dto.StitchEventDto;
import tax.black.core.tenancy.TenantContext;
import tax.black.core.web.api.WebhooksApiDelegate;

/** POST /api/webhooks/stitch. Unsigned or mismatched requests get 401 before anything is read. */
@Service
public class WebhooksDelegate implements WebhooksApiDelegate {

    private static final Logger LOG = LoggerFactory.getLogger(WebhooksDelegate.class);
    private final Settings settings;
    private final StitchEventService events;
    private final AgentClient agent;

    private final org.springframework.web.context.request.NativeWebRequest request;

    public WebhooksDelegate(Settings settings, StitchEventService events, AgentClient agent, org.springframework.web.context.request.NativeWebRequest request) {
        this.request = request;
        this.settings = settings;
        this.events = events;
        this.agent = agent;
    }

    @Override
    public java.util.Optional<org.springframework.web.context.request.NativeWebRequest> getRequest() {
        return java.util.Optional.of(request);
    }

    @Override
    public ResponseEntity<Void> receiveStitchWebhook(String signature, StitchEventDto event) {
        byte[] raw = getRequest()
            .map(r -> (byte[]) r.getAttribute(tax.black.core.config.RawBodyCachingFilter.RAW_BODY, org.springframework.web.context.request.RequestAttributes.SCOPE_REQUEST))
            .orElse(null);
        if (!StitchSignature.verify(settings.stitchWebhookSecret, signature, raw, Instant.now().getEpochSecond())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Bad signature");
        }
        String ref = event.getData() == null ? null : event.getData().getExternalReference();
        String[] parts = ref == null ? new String[0] : ref.split(":");
        if (parts.length < 2) throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_CONTENT, "externalReference must be <stokvelId>:<memberId>[:<period>]");
        boolean evaluate;
        TenantContext.set(parts[0], "SERVICE");
        try {
            evaluate = events.handle(event, parts[1], parts.length > 2 ? parts[2] : null);
        } finally {
            TenantContext.clear();
        }
        if (evaluate) {
            try {
                agent.evaluate(parts[0], "CONTRIBUTION_WEBHOOK");
            } catch (RuntimeException e) {
                LOG.warn("Agent evaluation after {} failed: {}", event.getType(), e.getMessage());
            }
        }
        return ResponseEntity.noContent().build();
    }
}
