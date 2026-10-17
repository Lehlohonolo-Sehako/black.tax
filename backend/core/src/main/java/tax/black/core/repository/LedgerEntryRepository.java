package tax.black.core.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import tax.black.core.domain.LedgerEntry;

/**
 * Spring Data JPA repository for the LedgerEntry entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LedgerEntryRepository extends JpaRepository<LedgerEntry, Long> {
    java.util.List<LedgerEntry> findAllByOrderByRecordedAtAscIdAsc();
    java.util.Optional<LedgerEntry> findFirstByOrderByRecordedAtDescIdDesc();
    java.util.Optional<LedgerEntry> findFirstByTenantIdOrderByRecordedAtDescIdDesc(String tenantId);
    java.util.List<LedgerEntry> findByTenantId(String tenantId);
    java.util.Optional<LedgerEntry> findOneByCode(String code);
}
