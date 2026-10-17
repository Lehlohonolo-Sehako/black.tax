package tax.black.core.blacktax;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.time.ZoneId;
import java.util.Locale;

/** Money and formatting helpers. API money is a 2-decimal string in rand. */
public final class M {

    public static final ZoneId SAST = ZoneId.of("Africa/Johannesburg");
    public static final BigDecimal ZERO = BigDecimal.ZERO.setScale(2);

    private M() {}

    public static String s(BigDecimal v) {
        return v == null ? null : v.setScale(2, RoundingMode.HALF_UP).toPlainString();
    }

    public static BigDecimal d(String v) {
        return v == null || v.isBlank() ? null : new BigDecimal(v).setScale(2, RoundingMode.HALF_UP);
    }

    /** Largest amount any request may carry (R1 billion). Keeps values inside the numeric(21,2) columns. */
    public static final BigDecimal MAX_AMOUNT = new BigDecimal("1000000000.00");

    /** A request amount: present, at least {@code min}, at most MAX_AMOUNT. Throws 400 otherwise. */
    public static BigDecimal amount(String v, BigDecimal min, String what) {
        BigDecimal d;
        try {
            d = d(v);
        } catch (NumberFormatException e) {
            d = null;
        }
        if (d == null || d.compareTo(min) < 0 || d.compareTo(MAX_AMOUNT) > 0) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST,
                what + " must be between " + rand(min) + " and " + rand(MAX_AMOUNT) + ".");
        }
        return d;
    }

    public static BigDecimal nz(BigDecimal v) {
        return v == null ? ZERO : v;
    }

    /** "R30,000" — used in agent and ledger prose, never in the API's numeric fields. */
    public static String rand(BigDecimal v) {
        NumberFormat f = NumberFormat.getIntegerInstance(Locale.US);
        return "R" + f.format(nz(v).abs().setScale(0, RoundingMode.HALF_UP));
    }

    public static String first(String name) {
        return name == null ? "" : name.split(" ")[0];
    }

    public static String initials(String name) {
        StringBuilder b = new StringBuilder();
        for (String p : name.trim().split("\\s+")) {
            if (!p.isEmpty() && b.length() < 2) b.append(Character.toUpperCase(p.charAt(0)));
        }
        return b.toString();
    }

    /** 0825550147 → +27 82 555 0147 */
    public static String intl(String local) {
        String d = local == null ? "" : local.replaceAll("\\D", "");
        if (d.length() != 10) return local;
        return "+27 " + d.substring(1, 3) + " " + d.substring(3, 6) + " " + d.substring(6);
    }

    public static String digits(String phone) {
        String d = phone == null ? "" : phone.replaceAll("\\D", "");
        if (d.startsWith("27") && d.length() == 11) d = "0" + d.substring(2);
        return d;
    }
}
