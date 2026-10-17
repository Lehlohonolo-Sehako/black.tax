package tax.black.core.blacktax.stitch;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestClient;
import tax.black.core.blacktax.M;
import tax.black.core.blacktax.Settings;
import tax.black.core.domain.Member;

/**
 * Stitch sandbox/production over GraphQL (https://api.stitch.money/graphql) with client-credentials auth.
 *
 * NOTE: the mutation documents below follow Stitch's DebiCheck/recurring-payment shape but have NOT been run
 * against the sandbox from this repo. Check field names against the Stitch API reference before enabling
 * `blacktax.stitch.mode=live`; the mock gateway is the default.
 */
@Component
@ConditionalOnProperty(name = "blacktax.stitch.mode", havingValue = "live")
public class StitchGraphqlGateway implements StitchGateway {

    static final String CREATE_MANDATE = """
        mutation CreateDebiCheckMandate($input: ClientDebiCheckMandateRequestInput!) {
          clientDebiCheckMandateRequestCreate(input: $input) { url id }
        }""";

    static final String INITIATE_COLLECTION = """
        mutation InitiateCollection($input: ClientDebitOrderPaymentInitiateInput!) {
          clientDebitOrderPaymentInitiate(input: $input) { id status }
        }""";

    private final Settings settings;
    private final RestClient api = RestClient.builder().baseUrl("https://api.stitch.money").build();
    private final RestClient auth = RestClient.builder().baseUrl("https://secure.stitch.money").build();

    public StitchGraphqlGateway(Settings settings) {
        this.settings = settings;
    }

    @SuppressWarnings("unchecked")
    private String token() {
        var form = new LinkedMultiValueMap<String, String>();
        form.add("grant_type", "client_credentials");
        form.add("client_id", settings.stitchClientId);
        form.add("client_secret", settings.stitchClientSecret);
        form.add("scope", "client_paymentrequest client_recurringpaymentconsentrequest");
        form.add("audience", "https://secure.stitch.money/connect/token");
        Map<String, Object> res = auth.post().uri("/connect/token").contentType(MediaType.APPLICATION_FORM_URLENCODED).body(form).retrieve().body(Map.class);
        return (String) res.get("access_token");
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> graphql(String query, Map<String, Object> variables) {
        Map<String, Object> res = api.post().uri("/graphql").header("Authorization", "Bearer " + token())
            .body(Map.of("query", query, "variables", variables)).retrieve().body(Map.class);
        if (res.get("errors") instanceof List<?> errors && !errors.isEmpty()) throw new IllegalStateException("Stitch: " + errors);
        return (Map<String, Object>) res.get("data");
    }

    @Override
    @SuppressWarnings("unchecked")
    public String requestMandate(String stokvelId, Member member, BigDecimal amount) {
        var input = Map.<String, Object>of(
            "amount", Map.of("quantity", M.s(amount), "currency", "ZAR"),
            "frequency", "MONTHLY",
            "externalReference", stokvelId + ":" + member.getCode(),
            "payer", Map.of("fullName", member.getName(), "phoneNumber", M.intl(member.getPhone()).replace(" ", ""))
        );
        Map<String, Object> data = graphql(CREATE_MANDATE, Map.of("input", input));
        return (String) ((Map<String, Object>) data.get("clientDebiCheckMandateRequestCreate")).get("url");
    }

    @Override
    @SuppressWarnings("unchecked")
    public String initiateCollection(String stokvelId, Member member, BigDecimal amount, String period) {
        var input = Map.<String, Object>of(
            "mandateId", member.getMandateId(),
            "amount", Map.of("quantity", M.s(amount), "currency", "ZAR"),
            "externalReference", stokvelId + ":" + member.getCode() + ":" + period
        );
        Map<String, Object> data = graphql(INITIATE_COLLECTION, Map.of("input", input));
        return (String) ((Map<String, Object>) data.get("clientDebitOrderPaymentInitiate")).get("id");
    }
}
