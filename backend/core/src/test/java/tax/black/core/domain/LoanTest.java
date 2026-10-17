package tax.black.core.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static tax.black.core.domain.LoanTestSamples.*;

import org.junit.jupiter.api.Test;
import tax.black.core.web.rest.TestUtil;

class LoanTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Loan.class);
        Loan loan1 = getLoanSample1();
        Loan loan2 = new Loan();
        assertThat(loan1).isNotEqualTo(loan2);

        loan2.setId(loan1.getId());
        assertThat(loan1).isEqualTo(loan2);

        loan2 = getLoanSample2();
        assertThat(loan1).isNotEqualTo(loan2);
    }
}
