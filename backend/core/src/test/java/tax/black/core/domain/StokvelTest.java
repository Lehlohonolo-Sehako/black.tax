package tax.black.core.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static tax.black.core.domain.StokvelTestSamples.*;

import org.junit.jupiter.api.Test;
import tax.black.core.web.rest.TestUtil;

class StokvelTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Stokvel.class);
        Stokvel stokvel1 = getStokvelSample1();
        Stokvel stokvel2 = new Stokvel();
        assertThat(stokvel1).isNotEqualTo(stokvel2);

        stokvel2.setId(stokvel1.getId());
        assertThat(stokvel1).isEqualTo(stokvel2);

        stokvel2 = getStokvelSample2();
        assertThat(stokvel1).isNotEqualTo(stokvel2);
    }
}
