package tax.black.core.blacktax;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

/** Client for the Python ledger service (api/ledger.yaml). */
@Component
public class LedgerClient {

    private static final Logger LOG = LoggerFactory.getLogger(LedgerClient.class);

    public record Posting(String account, String amount) {}

    public record Appended(String hash, String beancount) {}

    private final RestClient http;

    static org.springframework.http.client.SimpleClientHttpRequestFactory timeouts(int readSeconds) {
        var f = new org.springframework.http.client.SimpleClientHttpRequestFactory();
        f.setConnectTimeout(java.time.Duration.ofSeconds(5));
        f.setReadTimeout(java.time.Duration.ofSeconds(readSeconds));
        return f;
    }

    public LedgerClient(Settings settings) {
        this.http = RestClient.builder().baseUrl(settings.ledgerUrl).requestFactory(timeouts(10))
            .defaultHeader("X-Service-Token", settings.serviceToken).build();
    }

    @SuppressWarnings("unchecked")
    public Appended append(
        String stokvelId,
        String entryId,
        OffsetDateTime at,
        String type,
        String description,
        List<Posting> postings,
        boolean flagged,
        String reasoning,
        String arcTxHash,
        String decisionId
    ) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("stokvel_id", stokvelId);
        body.put("entry_id", entryId);
        body.put("timestamp", at.toString());
        body.put("type", type);
        body.put("description", description);
        List<Map<String, String>> entries = new ArrayList<>();
        for (Posting p : postings) entries.add(Map.of("account", p.account(), "amount", p.amount(), "currency", "ZAR"));
        body.put("entries", entries);
        body.put("flagged", flagged);
        if (reasoning != null) body.put("reasoning", reasoning);
        if (arcTxHash != null) body.put("arc_tx_hash", arcTxHash);
        if (decisionId != null) body.put("agent_decision_id", decisionId);
        Map<String, Object> res = http.post().uri("/ledger/append").body(body).retrieve().body(Map.class);
        LOG.debug("Ledger append {} {} → {}", stokvelId, entryId, res.get("hash"));
        return new Appended((String) res.get("hash"), (String) res.get("beancount"));
    }
}
