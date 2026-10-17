package tax.black.core.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static tax.black.core.domain.DebtTestSamples.*;
import static tax.black.core.domain.MemberTestSamples.*;

import org.junit.jupiter.api.Test;
import tax.black.core.web.rest.TestUtil;

class DebtTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Debt.class);
        Debt debt1 = getDebtSample1();
        Debt debt2 = new Debt();
        assertThat(debt1).isNotEqualTo(debt2);

        debt2.setId(debt1.getId());
        assertThat(debt1).isEqualTo(debt2);

        debt2 = getDebtSample2();
        assertThat(debt1).isNotEqualTo(debt2);
    }

    @Test
    void memberTest() {
        Debt debt = getDebtRandomSampleGenerator();
        Member memberBack = getMemberRandomSampleGenerator();

        debt.setMember(memberBack);
        assertThat(debt.getMember()).isEqualTo(memberBack);

        debt.member(null);
        assertThat(debt.getMember()).isNull();
    }
}
