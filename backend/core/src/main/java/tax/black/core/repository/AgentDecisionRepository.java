package tax.black.core.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import tax.black.core.domain.AgentDecision;

/**
 * Spring Data JPA repository for the AgentDecision entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AgentDecisionRepository extends JpaRepository<AgentDecision, Long> {
    java.util.List<AgentDecision> findAllByOrderByDecidedAtDescIdDesc();
    java.util.Optional<AgentDecision> findOneByCode(String code);
    java.util.List<AgentDecision> findByTenantId(String tenantId);
    java.util.Optional<AgentDecision> findFirstByOrderByDecidedAtDescIdDesc();
}
