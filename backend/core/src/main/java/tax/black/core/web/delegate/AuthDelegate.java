package tax.black.core.web.delegate;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import tax.black.core.blacktax.M;
import tax.black.core.blacktax.Settings;
import tax.black.core.domain.User;
import tax.black.core.repository.AuthorityRepository;
import tax.black.core.repository.UserRepository;
import tax.black.core.security.AuthoritiesConstants;
import tax.black.core.security.SecurityUtils;
import tax.black.core.service.api.dto.CurrentUserDto;
import tax.black.core.service.api.dto.OtpRequestDto;
import tax.black.core.service.api.dto.OtpVerificationDto;
import tax.black.core.service.api.dto.SessionDto;
import tax.black.core.web.api.AuthApiDelegate;

/** Phone + one-time code. No passwords. Codes expire after 10 minutes; three wrong tries burn the code. */
@Service
public class AuthDelegate implements AuthApiDelegate {

    private static final Logger LOG = LoggerFactory.getLogger(AuthDelegate.class);
    private record Pending(String code, Instant expires, int tries) {}

    private static final int MAX_REQUESTS = 5;
    private static final long REQUEST_WINDOW_SECONDS = 900;

    private final Map<String, Pending> codes = new ConcurrentHashMap<>();
    private final Map<String, java.util.Deque<Instant>> requests = new ConcurrentHashMap<>();
    private final SecureRandom random = new SecureRandom();
    private final UserRepository users;
    private final AuthorityRepository authorities;
    private final PasswordEncoder passwords;
    private final SessionIssuer sessions;
    private final Settings settings;

    public AuthDelegate(UserRepository users, AuthorityRepository authorities, PasswordEncoder passwords, SessionIssuer sessions, Settings settings) {
        this.users = users;
        this.authorities = authorities;
        this.passwords = passwords;
        this.sessions = sessions;
        this.settings = settings;
    }

    @Override
    @Transactional
    public ResponseEntity<Void> requestOtp(OtpRequestDto req) {
        String phone = M.digits(req.getPhone());
        if (!phone.matches("0\\d{9}")) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Enter all 10 digits, starting with 0.");
        boolean signUp = req.getIntent() == OtpRequestDto.IntentEnum.SIGN_UP;
        if (signUp && !Boolean.TRUE.equals(req.getPopiaConsent())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "We need your agreement before we can create your account.");
        }
        rateLimit(phone);
        if (signUp && users.findOneByLogin(phone).isEmpty()) createUser(phone, req.getName());
        String code = settings.fixedOtp.isBlank() ? String.format("%06d", random.nextInt(1_000_000)) : settings.fixedOtp;
        codes.put(phone, new Pending(code, Instant.now().plusSeconds(600), 0));
        // SMS provider hook. Never log the code outside dev.
        LOG.info("OTP requested for {}{}", M.intl(phone), settings.fixedOtp.isBlank() ? "" : " (fixed dev code)");
        return ResponseEntity.noContent().build();
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<SessionDto> verifyOtp(OtpVerificationDto req) {
        String phone = M.digits(req.getPhone());
        String given = req.getCode() == null ? "" : req.getCode();
        // Atomic per phone: parallel guesses each consume a try, and a match removes the code so it works once.
        boolean[] matched = { false };
        Pending after = codes.computeIfPresent(phone, (k, p) -> {
            if (p.expires().isBefore(Instant.now())) return null;
            if (java.security.MessageDigest.isEqual(p.code().getBytes(java.nio.charset.StandardCharsets.UTF_8), given.getBytes(java.nio.charset.StandardCharsets.UTF_8))) {
                matched[0] = true;
                return null;
            }
            return p.tries() + 1 >= 3 ? null : new Pending(p.code(), p.expires(), p.tries() + 1);
        });
        if (!matched[0]) {
            if (after == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "That code has expired or didn’t match three times. Ask for a new one.");
            int left = 3 - after.tries();
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                "That code didn’t match. You have " + left + (left == 1 ? " try" : " tries") + " left before we send a new one.");
        }
        User user = users.findOneWithAuthoritiesByLogin(phone)
            .filter(User::isActivated)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "There’s no account for this number. Start a stokvel or ask your treasurer for an invitation."));
        return ResponseEntity.ok(sessions.issue(user));
    }

    /** At most MAX_REQUESTS codes per phone per window, so codes can't be farmed; expired codes are evicted. */
    private void rateLimit(String phone) {
        Instant now = Instant.now();
        codes.entrySet().removeIf(e -> e.getValue().expires().isBefore(now));
        var q = requests.computeIfAbsent(phone, k -> new java.util.ArrayDeque<>());
        synchronized (q) {
            while (!q.isEmpty() && q.peekFirst().isBefore(now.minusSeconds(REQUEST_WINDOW_SECONDS))) q.pollFirst();
            if (q.size() >= MAX_REQUESTS) throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Too many codes requested. Try again in 15 minutes.");
            q.addLast(now);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<CurrentUserDto> getCurrentUser() {
        String login = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        User user = users.findOneWithAuthoritiesByLogin(login).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        return ResponseEntity.ok(sessions.currentUser(user));
    }

    public User createUser(String phone, String name) {
        String[] parts = (name == null || name.isBlank() ? "New member" : name.trim()).split(" ", 2);
        User u = new User();
        u.setLogin(phone);
        u.setFirstName(parts[0]);
        u.setLastName(parts.length > 1 ? parts[1] : null);
        u.setPassword(passwords.encode(UUID.randomUUID().toString()));
        u.setActivated(true);
        u.setLangKey("en");
        authorities.findById(AuthoritiesConstants.USER).ifPresent(a -> u.getAuthorities().add(a));
        return users.save(u);
    }
}
