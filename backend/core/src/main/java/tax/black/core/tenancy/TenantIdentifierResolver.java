package tax.black.core.tenancy;

import java.util.Map;
import org.hibernate.cfg.AvailableSettings;
import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.springframework.boot.hibernate.autoconfigure.HibernatePropertiesCustomizer;
import org.springframework.stereotype.Component;

/**
 * Feeds the request's stokvel to Hibernate, which filters every @TenantId entity by it.
 * Outside a tenant-scoped request (sign-in, the stokvel switcher, scheduled jobs before they pick a stokvel)
 * the resolver returns ROOT, which Hibernate treats as unfiltered.
 */
@Component
public class TenantIdentifierResolver implements CurrentTenantIdentifierResolver<String>, HibernatePropertiesCustomizer {

    @Override
    public String resolveCurrentTenantIdentifier() {
        String t = TenantContext.get();
        return t != null ? t : TenantContext.ROOT;
    }

    @Override
    public boolean validateExistingCurrentSessions() {
        return false;
    }

    @Override
    public boolean isRoot(String tenantId) {
        return TenantContext.ROOT.equals(tenantId);
    }

    @Override
    public void customize(Map<String, Object> hibernateProperties) {
        hibernateProperties.put(AvailableSettings.MULTI_TENANT_IDENTIFIER_RESOLVER, this);
    }
}
