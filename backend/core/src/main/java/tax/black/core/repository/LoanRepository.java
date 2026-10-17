package tax.black.core.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import tax.black.core.domain.Loan;

/**
 * Spring Data JPA repository for the Loan entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {
    java.util.List<Loan> findByDirectionOrderByDueDateAsc(tax.black.core.domain.enumeration.LoanDirection direction);
    java.util.List<Loan> findAllByOrderByDueDateAsc();
    long count();
}
