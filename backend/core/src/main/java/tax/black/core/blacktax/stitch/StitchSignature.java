package tax.black.core.blacktax.stitch;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

/**
 * X-Stitch-Signature: {@code t=<unix seconds>,v1=<hex HMAC-SHA256 of "<t>.<raw body>">}.
 * Verified in constant time, with a 5-minute replay window.
 */
public final class StitchSignature {

    public static final long TOLERANCE_SECONDS = 300;

    private StitchSignature() {}

    public static String sign(String secret, long t, byte[] body) {
        return "t=" + t + ",v1=" + hmac(secret, t, body);
    }

    public static boolean verify(String secret, String header, byte[] body, long nowSeconds) {
        if (header == null || body == null) return false;
        Long t = null;
        String v1 = null;
        for (String part : header.split(",")) {
            String[] kv = part.trim().split("=", 2);
            if (kv.length != 2) continue;
            if (kv[0].equals("t")) {
                try {
                    t = Long.parseLong(kv[1]);
                } catch (NumberFormatException e) {
                    return false;
                }
            } else if (kv[0].equals("v1")) v1 = kv[1];
        }
        if (t == null || v1 == null || Math.abs(nowSeconds - t) > TOLERANCE_SECONDS) return false;
        byte[] expected = hmac(secret, t, body).getBytes(StandardCharsets.US_ASCII);
        return MessageDigest.isEqual(expected, v1.getBytes(StandardCharsets.US_ASCII));
    }

    private static String hmac(String secret, long t, byte[] body) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            mac.update((t + ".").getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(mac.doFinal(body));
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }
}
