package tax.black.core.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static tax.black.core.domain.LedgerEntryTestSamples.*;

import org.junit.jupiter.api.Test;
import tax.black.core.web.rest.TestUtil;

class LedgerEntryTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LedgerEntry.class);
        LedgerEntry ledgerEntry1 = getLedgerEntrySample1();
        LedgerEntry ledgerEntry2 = new LedgerEntry();
        assertThat(ledgerEntry1).isNotEqualTo(ledgerEntry2);

        ledgerEntry2.setId(ledgerEntry1.getId());
        assertThat(ledgerEntry1).isEqualTo(ledgerEntry2);

        ledgerEntry2 = getLedgerEntrySample2();
        assertThat(ledgerEntry1).isNotEqualTo(ledgerEntry2);
    }
}
