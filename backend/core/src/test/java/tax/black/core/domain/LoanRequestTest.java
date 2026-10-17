package tax.black.core.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static tax.black.core.domain.LoanRequestTestSamples.*;

import org.junit.jupiter.api.Test;
import tax.black.core.web.rest.TestUtil;

class LoanRequestTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LoanRequest.class);
        LoanRequest loanRequest1 = getLoanRequestSample1();
        LoanRequest loanRequest2 = new LoanRequest();
        assertThat(loanRequest1).isNotEqualTo(loanRequest2);

        loanRequest2.setId(loanRequest1.getId());
        assertThat(loanRequest1).isEqualTo(loanRequest2);

        loanRequest2 = getLoanRequestSample2();
        assertThat(loanRequest1).isNotEqualTo(loanRequest2);
    }
}
