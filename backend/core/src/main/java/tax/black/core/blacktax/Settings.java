package tax.black.core.blacktax;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.stereotype.Component;

/** black.tax runtime settings. Secrets come from the environment, never the database. */
@Component
public class Settings {

    private static final Logger LOG = LoggerFactory.getLogger(Settings.class);
    private final Environment environment;

    public Settings(Environment environment) {
        this.environment = environment;
    }

    @Value("${blacktax.ledger-url:http://localhost:4200}")
    public String ledgerUrl;

    @Value("${blacktax.agent-url:http://localhost:4100}")
    public String agentUrl;

    /** Shared secret the agent sends as X-Service-Token, and core sends to the agent. */
    @Value("${blacktax.service-token:dev-service-token}")
    public String serviceToken;

    @Value("${blacktax.stitch.mode:mock}")
    public String stitchMode;

    @Value("${blacktax.stitch.webhook-secret:dev-stitch-webhook-secret}")
    public String stitchWebhookSecret;

    @Value("${blacktax.stitch.client-id:}")
    public String stitchClientId;

    @Value("${blacktax.stitch.client-secret:}")
    public String stitchClientSecret;

    @Value("${blacktax.stitch.public-url:http://localhost:8080}")
    public String publicUrl;

    /** When set, every OTP is this code (dev/demo only). Empty in production. */
    @Value("${blacktax.otp.fixed-code:}")
    public String fixedOtp;

    @Value("${blacktax.dev-endpoints:false}")
    public boolean devEndpoints;

    @Value("${blacktax.seed:false}")
    public boolean seed;

    /**
     * Demo shortcuts (fixed OTP, /api/dev/*, seeding) only exist under the dev profile, whatever the environment says.
     * Outside dev, default secrets are refused so a misconfigured deploy fails at start-up instead of being forgeable.
     */
    @PostConstruct
    void enforceProfile() {
        boolean dev = environment.acceptsProfiles(Profiles.of("dev"));
        if (!dev) {
            if (devEndpoints || !fixedOtp.isBlank() || seed) LOG.warn("Ignoring demo settings outside the dev profile");
            devEndpoints = false;
            fixedOtp = "";
            seed = false;
            if (serviceToken.isBlank() || serviceToken.equals("dev-service-token")) throw new IllegalStateException("Set SERVICE_TOKEN");
            if (stitchWebhookSecret.equals("dev-stitch-webhook-secret")) throw new IllegalStateException("Set STITCH_WEBHOOK_SECRET");
        }
        if (serviceToken.isBlank()) throw new IllegalStateException("SERVICE_TOKEN must not be empty");
    }
}
