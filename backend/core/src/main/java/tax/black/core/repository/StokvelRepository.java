package tax.black.core.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import tax.black.core.domain.Stokvel;

/**
 * Spring Data JPA repository for the Stokvel entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StokvelRepository extends JpaRepository<Stokvel, Long> {
    java.util.Optional<Stokvel> findOneByCode(String code);
}
