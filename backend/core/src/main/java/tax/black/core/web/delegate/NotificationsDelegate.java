package tax.black.core.web.delegate;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tax.black.core.blacktax.Mappers;
import tax.black.core.repository.NotificationRepository;
import tax.black.core.service.api.dto.NotificationDto;
import tax.black.core.web.api.NotificationsApiDelegate;

@Service
public class NotificationsDelegate implements NotificationsApiDelegate {

    private final NotificationRepository notifications;
    private final Mappers map;

    public NotificationsDelegate(NotificationRepository notifications, Mappers map) {
        this.notifications = notifications;
        this.map = map;
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<List<NotificationDto>> listNotifications(String stokvelId) {
        return ResponseEntity.ok(notifications.findTop20ByOrderBySentAtDesc().stream().map(map::notification).toList());
    }

    @Override
    @Transactional
    public ResponseEntity<Void> markNotificationsRead(String stokvelId) {
        notifications.findByUnreadTrue().forEach(n -> notifications.save(n.unread(false)));
        return ResponseEntity.noContent().build();
    }
}
