package tax.black.core.blacktax;

import java.util.Map;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

/** Client for the TypeScript agent service (api/agent.yaml). Responses are snake_case maps, as specified. */
@Component
public class AgentClient {

    private final RestClient http;

    public AgentClient(Settings settings) {
        this.http = RestClient.builder().baseUrl(settings.agentUrl).requestFactory(LedgerClient.timeouts(180)).defaultHeader("X-Service-Token", settings.serviceToken).build();
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> evaluate(String stokvelId, String trigger) {
        return http.post().uri("/agent/evaluate").body(Map.of("stokvel_id", stokvelId, "trigger", trigger)).retrieve().body(Map.class);
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> assess(String stokvelId, Map<String, Object> request, String payoutDate, String lendable) {
        var body = new java.util.HashMap<String, Object>();
        body.put("stokvel_id", stokvelId);
        body.put("request", request);
        if (payoutDate != null) body.put("payout_date", payoutDate);
        if (lendable != null) body.put("lendable", lendable);
        return http.post().uri("/agent/assess").body(body).retrieve().body(Map.class);
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> fundLoan(Map<String, Object> body) {
        return http.post().uri("/agent/loans/fund").body(body).retrieve().body(Map.class);
    }
}
