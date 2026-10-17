package tax.black.core.tenancy;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.support.TransactionTemplate;
import tax.black.core.IntegrationTest;
import tax.black.core.domain.*;
import tax.black.core.domain.enumeration.*;
import tax.black.core.repository.*;

/**
 * System design §8.3: two tenants, and isolation asserted on every tenant-scoped read endpoint, plus directly on
 * the Hibernate @TenantId filter. If one query forgets the tenant, this test is the one that fails.
 */
@IntegrationTest
@AutoConfigureMockMvc
class TenantIsolationIT {

    private static final String A = "iso-alpha", B = "iso-beta";
    private static final List<String> READS = List.of(
        "", "/dashboard", "/members", "/members/%s", "/ledger", "/ledger/%s", "/decisions", "/lendable", "/loan-requests", "/loans", "/notifications"
    );

    @Autowired MockMvc mvc;
    @Autowired StokvelRepository stokvels;
    @Autowired MemberRepository members;
    @Autowired LedgerEntryRepository ledger;
    @Autowired AgentDecisionRepository decisions;
    @Autowired LoanRepository loans;
    @Autowired TransactionTemplate tx;

    @BeforeEach
    void twoTenants() {
        for (String t : List.of(A, B)) {
            TenantContext.set(t, "SERVICE");
            try {
                tx.executeWithoutResult(s -> {
                    stokvels.save(new Stokvel().code(t).name(t).stokvelType(StokvelType.GROCERY).contributionAmount(BigDecimal.TEN)
                        .frequency(Frequency.MONTHLY).reserveFloor(BigDecimal.ONE).lendingEnabled(true).paused(false).createdAt(Instant.now()));
                    members.save(new Member().tenantId(t).code(t + "-treasurer").userLogin("user-" + t).name("Treasurer " + t).role(MemberRole.TREASURER)
                        .contributionAmount(BigDecimal.TEN).mandateStatus(MandateStatus.ACTIVE).mandateId("DCK-" + t).removed(false));
                    members.save(new Member().tenantId(t).code(t + "-member").userLogin("member-" + t).name("Member " + t).role(MemberRole.MEMBER)
                        .contributionAmount(BigDecimal.TEN).mandateStatus(MandateStatus.ACTIVE).mandateId("DCK-m-" + t).removed(false));
                    ledger.save(new LedgerEntry().tenantId(t).code(t + "-L1").recordedAt(Instant.now()).entryType(LedgerEntryType.CONTRIBUTION)
                        .description("Contributions " + t).amount(BigDecimal.TEN).runningBalance(BigDecimal.TEN));
                    decisions.save(new AgentDecision().tenantId(t).code(t + "-D1").decidedAt(Instant.now()).decisionType(DecisionType.HOLD)
                        .summary("Decision " + t).inputs("[]"));
                    loans.save(new Loan().tenantId(t).code(t + "-LN").direction(LoanDirection.OUT).counterparty("x").principal(BigDecimal.ONE)
                        .ratePct(BigDecimal.ONE).termDays(30).repaid(BigDecimal.ZERO).totalDue(BigDecimal.ONE).dueDate(LocalDate.now()).status(LoanStatus.ON_TRACK));
                });
            } finally {
                TenantContext.clear();
            }
        }
    }

    @AfterEach
    void cleanUp() {
        tx.executeWithoutResult(s -> {
            loans.findAll().stream().filter(x -> x.getTenantId().startsWith("iso-")).forEach(loans::delete);
            decisions.findAll().stream().filter(x -> x.getTenantId().startsWith("iso-")).forEach(decisions::delete);
            ledger.findAll().stream().filter(x -> x.getTenantId().startsWith("iso-")).forEach(ledger::delete);
            members.findAll().stream().filter(x -> x.getTenantId().startsWith("iso-")).forEach(members::delete);
            stokvels.findAll().stream().filter(x -> x.getCode().startsWith("iso-")).forEach(stokvels::delete);
        });
    }

    private String path(String stokvel, String suffix) {
        String id = suffix.startsWith("/members/") ? stokvel + "-member" : stokvel + "-L1";
        return "/api/stokvels/" + stokvel + (suffix.contains("%s") ? String.format(suffix, id) : suffix);
    }

    @Test
    @WithMockUser(username = "user-" + A)
    void everyReadEndpointRefusesAnotherTenant() throws Exception {
        for (String r : READS) {
            mvc.perform(get(path(B, r))).andExpect(status().isNotFound());
        }
    }

    @Test
    @WithMockUser(username = "user-" + A)
    void everyReadEndpointWorksForOwnTenantAndReturnsOnlyItsRows() throws Exception {
        for (String r : READS) {
            mvc.perform(get(path(A, r))).andExpect(status().isOk());
        }
        mvc.perform(get("/api/stokvels/" + A + "/members")).andExpect(jsonPath("$.length()").value(2))
            .andExpect(jsonPath("$[*].id", org.hamcrest.Matchers.everyItem(org.hamcrest.Matchers.startsWith(A))));
        mvc.perform(get("/api/stokvels/" + A + "/ledger")).andExpect(jsonPath("$.entries.length()").value(1))
            .andExpect(jsonPath("$.entries[0].id").value(A + "-L1"));
        mvc.perform(get("/api/stokvels/" + A + "/decisions")).andExpect(jsonPath("$.length()").value(1));
        mvc.perform(get("/api/stokvels/" + A + "/loans")).andExpect(jsonPath("$.length()").value(1));
        // A member code from tenant B, asked for through tenant A's path, does not exist.
        mvc.perform(get("/api/stokvels/" + A + "/members/" + B + "-member")).andExpect(status().isNotFound());
        mvc.perform(get("/api/stokvels/" + A + "/ledger/" + B + "-L1")).andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "member-" + A)
    void membersCanReadButNotChangeTheConstitution() throws Exception {
        mvc.perform(get("/api/stokvels/" + A + "/ledger")).andExpect(status().isOk());
        mvc.perform(patch("/api/stokvels/" + A + "/constitution").contentType(MediaType.APPLICATION_JSON).content("{\"reserveFloor\":\"0.00\"}"))
            .andExpect(status().isForbidden());
    }

    @Test
    void internalEndpointsNeedTheServiceToken() throws Exception {
        mvc.perform(get("/api/internal/stokvels/" + A + "/state")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/internal/stokvels/" + A + "/state").header("X-Service-Token", "test-service-token")).andExpect(status().isOk())
            .andExpect(jsonPath("$.members.length()").value(2));
    }

    @Test
    void hibernateFilterScopesRepositoryReads() {
        TenantContext.set(A, "SERVICE");
        try {
            List<Member> seen = tx.execute(s -> members.findAll());
            assertThat(seen).isNotEmpty().allMatch(m -> m.getTenantId().equals(A));
            List<LedgerEntry> entries = tx.execute(s -> ledger.findAll());
            assertThat(entries).isNotEmpty().allMatch(e -> e.getTenantId().equals(A));
        } finally {
            TenantContext.clear();
        }
    }
}
