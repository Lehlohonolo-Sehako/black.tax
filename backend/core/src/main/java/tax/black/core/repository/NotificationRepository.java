package tax.black.core.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import tax.black.core.domain.Notification;

/**
 * Spring Data JPA repository for the Notification entity.
 */
@SuppressWarnings("unused")
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    java.util.List<Notification> findTop20ByOrderBySentAtDesc();
    java.util.List<Notification> findByUnreadTrue();
}
