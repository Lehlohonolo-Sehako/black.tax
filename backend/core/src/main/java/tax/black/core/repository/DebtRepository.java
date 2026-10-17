package tax.black.core.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tax.black.core.domain.Debt;

/**
 * Spring Data JPA repository for the Debt entity.
 */
@Repository
public interface DebtRepository extends JpaRepository<Debt, Long> {
    java.util.Optional<Debt> findOneByMemberCode(String memberCode);

    default Optional<Debt> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Debt> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Debt> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(value = "select debt from Debt debt left join fetch debt.member", countQuery = "select count(debt) from Debt debt")
    Page<Debt> findAllWithToOneRelationships(Pageable pageable);

    @Query("select debt from Debt debt left join fetch debt.member")
    List<Debt> findAllWithToOneRelationships();

    @Query("select debt from Debt debt left join fetch debt.member where debt.id =:id")
    Optional<Debt> findOneWithToOneRelationships(@Param("id") Long id);
}
