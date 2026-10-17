package tax.black.core.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import tax.black.core.domain.Member;

/**
 * Spring Data JPA repository for the Member entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    java.util.List<Member> findByRemovedFalseOrRemovedIsNullOrderByQueuePositionAscIdAsc();
    java.util.Optional<Member> findOneByCode(String code);
    java.util.List<Member> findByUserLogin(String userLogin);
    java.util.Optional<Member> findOneByTenantIdAndUserLogin(String tenantId, String userLogin);
    java.util.List<Member> findByTenantId(String tenantId);
}
