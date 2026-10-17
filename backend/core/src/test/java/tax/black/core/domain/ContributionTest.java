package tax.black.core.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static tax.black.core.domain.ContributionTestSamples.*;
import static tax.black.core.domain.MemberTestSamples.*;

import org.junit.jupiter.api.Test;
import tax.black.core.web.rest.TestUtil;

class ContributionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Contribution.class);
        Contribution contribution1 = getContributionSample1();
        Contribution contribution2 = new Contribution();
        assertThat(contribution1).isNotEqualTo(contribution2);

        contribution2.setId(contribution1.getId());
        assertThat(contribution1).isEqualTo(contribution2);

        contribution2 = getContributionSample2();
        assertThat(contribution1).isNotEqualTo(contribution2);
    }

    @Test
    void memberTest() {
        Contribution contribution = getContributionRandomSampleGenerator();
        Member memberBack = getMemberRandomSampleGenerator();

        contribution.setMember(memberBack);
        assertThat(contribution.getMember()).isEqualTo(memberBack);

        contribution.member(null);
        assertThat(contribution.getMember()).isNull();
    }
}
