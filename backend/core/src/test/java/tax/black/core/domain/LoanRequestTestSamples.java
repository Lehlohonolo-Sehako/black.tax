package tax.black.core.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class LoanRequestTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static LoanRequest getLoanRequestSample1() {
        return new LoanRequest()
            .id(1L)
            .tenantId("tenantId1")
            .code("code1")
            .borrowerCode("borrowerCode1")
            .borrowerName("borrowerName1")
            .borrowerMembers(1)
            .monthsActive(1)
            .contributionRecord("contributionRecord1")
            .priorLoans(1)
            .priorDefaults(1)
            .borrowerWallet("borrowerWallet1")
            .termDays(1)
            .escrowAddress("escrowAddress1")
            .declineReason("declineReason1")
            .declineNote("declineNote1")
            .note("note1");
    }

    public static LoanRequest getLoanRequestSample2() {
        return new LoanRequest()
            .id(2L)
            .tenantId("tenantId2")
            .code("code2")
            .borrowerCode("borrowerCode2")
            .borrowerName("borrowerName2")
            .borrowerMembers(2)
            .monthsActive(2)
            .contributionRecord("contributionRecord2")
            .priorLoans(2)
            .priorDefaults(2)
            .borrowerWallet("borrowerWallet2")
            .termDays(2)
            .escrowAddress("escrowAddress2")
            .declineReason("declineReason2")
            .declineNote("declineNote2")
            .note("note2");
    }

    public static LoanRequest getLoanRequestRandomSampleGenerator() {
        return new LoanRequest()
            .id(longCount.incrementAndGet())
            .tenantId(UUID.randomUUID().toString())
            .code(UUID.randomUUID().toString())
            .borrowerCode(UUID.randomUUID().toString())
            .borrowerName(UUID.randomUUID().toString())
            .borrowerMembers(intCount.incrementAndGet())
            .monthsActive(intCount.incrementAndGet())
            .contributionRecord(UUID.randomUUID().toString())
            .priorLoans(intCount.incrementAndGet())
            .priorDefaults(intCount.incrementAndGet())
            .borrowerWallet(UUID.randomUUID().toString())
            .termDays(intCount.incrementAndGet())
            .escrowAddress(UUID.randomUUID().toString())
            .declineReason(UUID.randomUUID().toString())
            .declineNote(UUID.randomUUID().toString())
            .note(UUID.randomUUID().toString());
    }
}
