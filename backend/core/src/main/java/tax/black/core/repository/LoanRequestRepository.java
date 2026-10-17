package tax.black.core.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import tax.black.core.domain.LoanRequest;

/**
 * Spring Data JPA repository for the LoanRequest entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LoanRequestRepository extends JpaRepository<LoanRequest, Long> {
    java.util.List<LoanRequest> findByStatusOrderByCreatedAtAsc(tax.black.core.domain.enumeration.LoanRequestStatus status);
    java.util.Optional<LoanRequest> findOneByCode(String code);

    /** Claim a request for funding. Exactly one concurrent caller gets 1; everyone else gets 0. */
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    @org.springframework.data.jpa.repository.Query("update LoanRequest r set r.status = :to where r.code = :code and r.status = :from and r.tenantId = :tenant")
    int transition(@org.springframework.data.repository.query.Param("tenant") String tenant, @org.springframework.data.repository.query.Param("code") String code,
        @org.springframework.data.repository.query.Param("from") tax.black.core.domain.enumeration.LoanRequestStatus from,
        @org.springframework.data.repository.query.Param("to") tax.black.core.domain.enumeration.LoanRequestStatus to);
}
