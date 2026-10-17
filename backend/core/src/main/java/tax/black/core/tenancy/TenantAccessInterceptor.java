package tax.black.core.tenancy;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.security.MessageDigest;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.HandlerMapping;
import tax.black.core.blacktax.Settings;
import tax.black.core.domain.enumeration.MandateStatus;
import tax.black.core.repository.MemberRepository;
import tax.black.core.repository.StokvelRepository;
import tax.black.core.security.SecurityUtils;

/**
 * Scopes every /api/stokvels/{stokvelId}/** request to one tenant.
 * The caller must be a (non-removed, non-invited) member of that stokvel; the agent service uses
 * /api/internal/stokvels/{stokvelId}/** with the service token instead.
 */
@Component
public class TenantAccessInterceptor implements HandlerInterceptor {

    private final MemberRepository members;
    private final StokvelRepository stokvels;
    private final Settings settings;

    public TenantAccessInterceptor(MemberRepository members, StokvelRepository stokvels, Settings settings) {
        this.members = members;
        this.stokvels = stokvels;
        this.settings = settings;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        TenantContext.clear();
        @SuppressWarnings("unchecked")
        Map<String, String> vars = (Map<String, String>) request.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE);
        String stokvelId = vars == null ? null : vars.get("stokvelId");
        if (stokvelId == null) {
            return true;
        }
        String path = request.getRequestURI();
        if (path.startsWith("/api/internal/")) {
            if (!isServiceCall(request)) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Service token required");
            }
            requireStokvel(stokvelId);
            TenantContext.set(stokvelId, "SERVICE");
            return true;
        }
        String login = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        // Runs at ROOT (no tenant yet): the membership lookup itself must see across tenants.
        var member = members
            .findOneByTenantIdAndUserLogin(stokvelId, login)
            .filter(m -> !Boolean.TRUE.equals(m.getRemoved()))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No such stokvel"));
        if (member.getMandateStatus() == MandateStatus.PENDING && member.getMandateId() == null
            && member.getRole() == tax.black.core.domain.enumeration.MemberRole.MEMBER) {
            // An invitation that has not been accepted with the bank yet.
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Accept the invitation first");
        }
        TenantContext.set(stokvelId, member.getRole().name());
        return true;
    }

    private void requireStokvel(String code) {
        if (stokvels.findOneByCode(code).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No such stokvel");
        }
    }

    public boolean isServiceCall(HttpServletRequest request) {
        String token = request.getHeader("X-Service-Token");
        return token != null
            && MessageDigest.isEqual(token.getBytes(StandardCharsets.UTF_8), settings.serviceToken.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        TenantContext.clear();
    }

    /** Treasurer-only operations call this. Members can read everything but change nothing. */
    public static void requireTreasurer() {
        if (!TenantContext.isTreasurer()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the treasurer can do this");
        }
    }
}
