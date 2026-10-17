package tax.black.core.tenancy;

/** The stokvel (tenant) the current request is scoped to. Set by TenantAccessInterceptor, cleared after the request. */
public final class TenantContext {

    public static final String ROOT = "__root__";
    private static final ThreadLocal<String> TENANT = new ThreadLocal<>();
    private static final ThreadLocal<String> ROLE = new ThreadLocal<>();

    private TenantContext() {}

    public static void set(String tenantId, String role) {
        TENANT.set(tenantId);
        ROLE.set(role);
    }

    public static String get() {
        return TENANT.get();
    }

    public static boolean isTreasurer() {
        return "TREASURER".equals(ROLE.get()) || "SERVICE".equals(ROLE.get());
    }

    public static void clear() {
        TENANT.remove();
        ROLE.remove();
    }
}
