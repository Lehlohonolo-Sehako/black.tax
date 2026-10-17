package tax.black.core.web.delegate;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import tax.black.core.blacktax.M;
import tax.black.core.blacktax.Settings;
import tax.black.core.blacktax.stitch.StitchWebhookSender;
import tax.black.core.repository.UserRepository;
import tax.black.core.service.api.dto.DevSessionRequestDto;
import tax.black.core.service.api.dto.SessionDto;
import tax.black.core.service.api.dto.SimulatedStitchEventDto;
import tax.black.core.web.api.DevApiDelegate;

/** Demo-only. Disabled unless blacktax.dev-endpoints=true. */
@Service
public class DevDelegate implements DevApiDelegate {

    private final Settings settings;
    private final UserRepository users;
    private final SessionIssuer sessions;
    private final StitchWebhookSender stitch;

    public DevDelegate(Settings settings, UserRepository users, SessionIssuer sessions, StitchWebhookSender stitch) {
        this.settings = settings;
        this.users = users;
        this.sessions = sessions;
        this.stitch = stitch;
    }

    private void enabled() {
        if (!settings.devEndpoints) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<SessionDto> devSession(DevSessionRequestDto req) {
        enabled();
        var user = users.findOneWithAuthoritiesByLogin(M.digits(req.getPhone())).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return ResponseEntity.ok(sessions.issue(user));
    }

    @Override
    public ResponseEntity<Void> simulateStitchEvent(SimulatedStitchEventDto e) {
        enabled();
        String ref = e.getStokvelId() + ":" + e.getMemberId() + (e.getPeriod() == null ? "" : ":" + e.getPeriod());
        String mandate = e.getType() == SimulatedStitchEventDto.TypeEnum.MANDATE_AUTHENTICATED ? "DCK-SIM-" + Math.abs(ref.hashCode() % 10000) : null;
        String payment = e.getType().name().startsWith("PAYMENT") ? "pay_sim_" + System.currentTimeMillis() : null;
        stitch.deliver(e.getType().name(), mandate, payment, ref, M.d(e.getAmount()), e.getReason());
        return ResponseEntity.accepted().build();
    }
}
