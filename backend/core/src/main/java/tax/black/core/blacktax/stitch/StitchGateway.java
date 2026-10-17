package tax.black.core.blacktax.stitch;

import java.math.BigDecimal;
import tax.black.core.domain.Member;

/** DebiCheck via Stitch. Results arrive later as signed webhooks; these calls only start things. */
public interface StitchGateway {
    /** Returns the Stitch-hosted page where the member authenticates the mandate with their bank. */
    String requestMandate(String stokvelId, Member member, BigDecimal amount);

    /** Starts a collection against the member's mandate. Returns Stitch's payment id. */
    String initiateCollection(String stokvelId, Member member, BigDecimal amount, String period);
}
