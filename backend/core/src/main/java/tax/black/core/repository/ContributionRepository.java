package tax.black.core.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tax.black.core.domain.Contribution;

/**
 * Spring Data JPA repository for the Contribution entity.
 */
@Repository
public interface ContributionRepository extends JpaRepository<Contribution, Long> {
    java.util.List<Contribution> findByMemberCodeOrderByPeriodAsc(String memberCode);
    java.util.List<Contribution> findByPeriod(String period);
    java.util.Optional<Contribution> findOneByMemberCodeAndPeriod(String memberCode, String period);

    default Optional<Contribution> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Contribution> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Contribution> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select contribution from Contribution contribution left join fetch contribution.member",
        countQuery = "select count(contribution) from Contribution contribution"
    )
    Page<Contribution> findAllWithToOneRelationships(Pageable pageable);

    @Query("select contribution from Contribution contribution left join fetch contribution.member")
    List<Contribution> findAllWithToOneRelationships();

    @Query("select contribution from Contribution contribution left join fetch contribution.member where contribution.id =:id")
    Optional<Contribution> findOneWithToOneRelationships(@Param("id") Long id);
}
