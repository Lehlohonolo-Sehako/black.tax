package tax.black.core.web.delegate;

import static tax.black.core.security.SecurityUtils.AUTHORITIES_CLAIM;
import static tax.black.core.security.SecurityUtils.JWT_ALGORITHM;
import static tax.black.core.security.SecurityUtils.USER_ID_CLAIM;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Component;
import tax.black.core.blacktax.M;
import tax.black.core.domain.Authority;
import tax.black.core.domain.User;
import tax.black.core.repository.MemberRepository;
import tax.black.core.service.api.dto.CurrentUserDto;
import tax.black.core.service.api.dto.CurrentUserMembershipsInnerDto;
import tax.black.core.service.api.dto.RoleDto;
import tax.black.core.service.api.dto.SessionDto;

/** Issues the same JWT JHipster's /api/authenticate does, for a user who proved their phone with an OTP. */
@Component
public class SessionIssuer {

    private final JwtEncoder jwtEncoder;
    private final MemberRepository members;

    @Value("${jhipster.security.authentication.jwt.token-validity-in-seconds:86400}")
    private long validity;

    public SessionIssuer(JwtEncoder jwtEncoder, MemberRepository members) {
        this.jwtEncoder = jwtEncoder;
        this.members = members;
    }

    public SessionDto issue(User user) {
        Instant now = Instant.now();
        String authorities = user.getAuthorities().stream().map(Authority::getName).collect(Collectors.joining(" "));
        JwtClaimsSet claims = JwtClaimsSet.builder()
            .issuedAt(now)
            .expiresAt(now.plus(validity, ChronoUnit.SECONDS))
            .subject(user.getLogin())
            .claim(AUTHORITIES_CLAIM, authorities)
            .claim(USER_ID_CLAIM, user.getId())
            .build();
        String token = jwtEncoder.encode(JwtEncoderParameters.from(JwsHeader.with(JWT_ALGORITHM).build(), claims)).getTokenValue();
        return new SessionDto().idToken(token).user(currentUser(user));
    }

    /** Runs without a tenant, so it sees the user's memberships in every stokvel. */
    public CurrentUserDto currentUser(User user) {
        String name = ((user.getFirstName() == null ? "" : user.getFirstName()) + " " + (user.getLastName() == null ? "" : user.getLastName())).trim();
        List<CurrentUserMembershipsInnerDto> memberships = members.findByUserLogin(user.getLogin()).stream()
            .filter(m -> !Boolean.TRUE.equals(m.getRemoved()))
            .map(m -> new CurrentUserMembershipsInnerDto().stokvelId(m.getTenantId()).memberId(m.getCode()).role(RoleDto.fromValue(m.getRole().name())))
            .toList();
        String town = members.findByUserLogin(user.getLogin()).stream().map(tax.black.core.domain.Member::getTown)
            .filter(t -> t != null).findFirst().orElse(null);
        return new CurrentUserDto().id(user.getLogin()).name(name).initials(M.initials(name)).phone(M.intl(user.getLogin())).town(town)
            .memberships(memberships);
    }
}
