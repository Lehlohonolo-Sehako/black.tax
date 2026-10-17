package tax.black.core.web.delegate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Clock;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import tax.black.core.blacktax.AgentClient;
import tax.black.core.blacktax.LedgerService;
import tax.black.core.blacktax.M;
import tax.black.core.blacktax.Mappers;
import tax.black.core.blacktax.Tenant;
import tax.black.core.domain.LedgerEntry;
import tax.black.core.domain.Loan;
import tax.black.core.domain.LoanRequest;
import tax.black.core.domain.Stokvel;
import tax.black.core.domain.enumeration.*;
import tax.black.core.repository.LedgerEntryRepository;
import tax.black.core.repository.LoanRepository;
import tax.black.core.repository.LoanRequestRepository;
import tax.black.core.service.api.dto.*;
import tax.black.core.tenancy.TenantAccessInterceptor;
import tax.black.core.tenancy.TenantContext;
import tax.black.core.web.api.LendingApiDelegate;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

@Service
public class LendingDelegate implements LendingApiDelegate {

    private final Tenant tenant;
    private final LoanRequestRepository requests;
    private final LoanRepository loans;
    private final LedgerEntryRepository ledgerEntries;
    private final LedgerService ledger;
    private final AgentClient agent;
    private final Mappers map;
    private final ObjectMapper json;
    private final Clock clock;

    public LendingDelegate(Tenant tenant, LoanRequestRepository requests, LoanRepository loans, LedgerEntryRepository ledgerEntries,
        LedgerService ledger, AgentClient agent, Mappers map, ObjectMapper json, Clock clock) {
        this.tenant = tenant;
        this.requests = requests;
        this.loans = loans;
        this.ledgerEntries = ledgerEntries;
        this.ledger = ledger;
        this.agent = agent;
        this.map = map;
        this.json = json;
        this.clock = clock;
    }

    /** pool − reserve floor − upcoming obligations. Loans funded today already reduced the pool through the ledger. */
    @Transactional(readOnly = true)
    public LendableDto lendable() {
        Stokvel s = tenant.stokvel();
        BigDecimal pool = ledger.balance();
        List<LendableObligationsInnerDto> obligations = new ArrayList<>();
        BigDecimal owed = BigDecimal.ZERO;
        if (s.getPayoutSchedule() != null && !s.getPayoutSchedule().isBlank()) {
            Map<String, Object> sched = json.readValue(s.getPayoutSchedule(), new TypeReference<Map<String, Object>>() {});
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> obs = (List<Map<String, Object>>) sched.getOrDefault("obligations", List.of());
            for (Map<String, Object> o : obs) {
                BigDecimal amt = M.d(String.valueOf(o.get("amount")));
                owed = owed.add(amt);
                obligations.add(new LendableObligationsInnerDto().label((String) o.get("label")).due(LocalDate.parse((String) o.get("due"))).amount(M.s(amt)));
            }
        }
        LocalDate today = map.today();
        BigDecimal lentToday = ledgerEntries.findAllByOrderByRecordedAtAscIdAsc().stream()
            .filter(e -> e.getEntryType() == LedgerEntryType.LOAN_OUT && e.getRecordedAt().atZone(M.SAST).toLocalDate().equals(today))
            .map(LedgerEntry::getAmount).map(BigDecimal::abs).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal lendable = Boolean.TRUE.equals(s.getLendingEnabled()) ? pool.subtract(s.getReserveFloor()).subtract(owed).max(BigDecimal.ZERO) : BigDecimal.ZERO;
        return new LendableDto().pool(M.s(pool)).reserveFloor(M.s(s.getReserveFloor())).obligations(obligations).lentToday(M.s(lentToday)).lendable(M.s(lendable));
    }

    @Override
    public ResponseEntity<LendableDto> getLendable(String stokvelId) {
        return ResponseEntity.ok(lendable());
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<List<LoanRequestDto>> listLoanRequests(String stokvelId) {
        return ResponseEntity.ok(requests.findByStatusOrderByCreatedAtAsc(LoanRequestStatus.OPEN).stream().map(map::loanRequest).toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<LoanRequestDto> getLoanRequest(String stokvelId, String requestId) {
        return ResponseEntity.ok(map.loanRequest(request(requestId)));
    }

    private LoanRequest request(String code) {
        return requests.findOneByCode(code).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No such request"));
    }

    @Override
    public ResponseEntity<LoanRequestDto> createLoanRequest(String stokvelId, NewLoanRequestDto req) {
        Stokvel s = tenant.stokvel();
        if (!Boolean.TRUE.equals(s.getLendingEnabled())) throw new ResponseStatusException(HttpStatus.CONFLICT, "Lending is off for " + s.getName());
        BorrowerProfileDto b = req.getBorrower();
        BigDecimal amount = M.d(req.getAmount());
        M.amount(req.getAmount(), new BigDecimal("1.00"), "The amount");
        if (b.getName() == null || b.getName().isBlank() || b.getName().length() > 120) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The borrower needs a name of up to 120 characters.");
        if (req.getTermDays() == null || req.getTermDays() < 7 || req.getTermDays() > 365) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The term must be 7 to 365 days.");
        if (req.getRatePct() == null || req.getRatePct().doubleValue() < 0 || req.getRatePct().doubleValue() > 100) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The rate must be 0% to 100%.");
        String code = "REQ-" + (requests.count() + 31);
        LoanRequest r = new LoanRequest().tenantId(tenant.id()).code(code).borrowerCode(b.getStokvelId()).borrowerName(b.getName())
            .borrowerType(StokvelType.valueOf(b.getType().name())).borrowerMembers(b.getMembers()).monthsActive(b.getMonthsActive())
            .contributionRecord(b.getContributionRecord()).priorLoans(b.getPriorLoans()).priorDefaults(b.getDefaults())
            .reserveBalance(M.d(b.getReserveBalance())).borrowerReserveFloor(M.d(b.getReserveFloor())).borrowerWallet(b.getWalletAddress())
            .amount(amount).termDays(req.getTermDays()).ratePct(BigDecimal.valueOf(req.getRatePct().doubleValue())).purpose(req.getPurpose())
            .dueDate(map.today().plusDays(req.getTermDays()))
            .interest(amount.multiply(BigDecimal.valueOf(req.getRatePct().doubleValue())).multiply(BigDecimal.valueOf(req.getTermDays()))
                .divide(BigDecimal.valueOf(36500), 0, RoundingMode.HALF_UP).setScale(2))
            .status(LoanRequestStatus.OPEN).createdAt(clock.instant());
        r = requests.save(r);
        // The lender's agent assesses on arrival and records an ASSESS decision itself.
        Map<String, Object> body = new HashMap<>();
        body.put("id", code);
        body.put("borrower", Map.of("name", b.getName(), "type", b.getType().getValue(), "members", b.getMembers(), "monthsActive", b.getMonthsActive(),
            "contributionRecord", b.getContributionRecord() == null ? "" : b.getContributionRecord(), "priorLoans", b.getPriorLoans() == null ? 0 : b.getPriorLoans(),
            "defaults", b.getDefaults() == null ? 0 : b.getDefaults(), "reserveBalance", b.getReserveBalance() == null ? "0" : b.getReserveBalance(),
            "reserveFloor", b.getReserveFloor() == null ? "0" : b.getReserveFloor()));
        body.put("amount", M.s(amount));
        body.put("termDays", req.getTermDays());
        body.put("ratePct", req.getRatePct());
        body.put("dueDate", r.getDueDate().toString());
        try {
            Map<String, Object> a = agent.assess(tenant.id(), body, s.getPayoutDate() == null ? null : s.getPayoutDate().toString(), lendable().getLendable());
            r.tier(CreditTier.valueOf((String) a.get("tier"))).recommend((Boolean) a.get("recommend")).reasoning((String) a.get("reasoning"))
                .note((String) a.get("note"));
            r = requests.save(r);
        } catch (RuntimeException e) {
            // Stays OPEN without an assessment; the treasurer sees it once the agent is back.
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(map.loanRequest(r));
    }

    @Override
    public ResponseEntity<LoanApprovalDto> approveLoanRequest(String stokvelId, String requestId) {
        TenantAccessInterceptor.requireTreasurer();
        LoanRequest r = request(requestId);
        if (r.getStatus() != LoanRequestStatus.OPEN) throw new ResponseStatusException(HttpStatus.CONFLICT, "This request is already " + r.getStatus().name().toLowerCase());
        BigDecimal before = M.d(lendable().getLendable());
        if (r.getAmount().compareTo(before) > 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You can lend " + M.rand(before) + " safely right now, less than " + M.rand(r.getAmount()) + ".");
        }
        Map<String, Object> body = new HashMap<>();
        body.put("stokvel_id", stokvelId);
        body.put("loan_request_id", r.getCode());
        body.put("amount", M.s(r.getAmount()));
        body.put("term_days", r.getTermDays());
        body.put("rate_pct", r.getRatePct());
        body.put("borrower_name", r.getBorrowerName());
        if (r.getBorrowerWallet() != null) body.put("borrower_wallet", r.getBorrowerWallet());
        // Claim the request before any money moves: a double click or a concurrent approval gets 409, not a second escrow.
        if (requests.transition(TenantContext.get(), r.getCode(), LoanRequestStatus.OPEN, LoanRequestStatus.APPROVED) != 1) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This request is already being approved");
        }
        Map<String, Object> res;
        try {
            res = AgentDelegate.callAgent(() -> agent.fundLoan(body));
        } catch (RuntimeException e) {
            requests.transition(TenantContext.get(), r.getCode(), LoanRequestStatus.APPROVED, LoanRequestStatus.OPEN);
            throw e;
        }
        String status = (String) res.get("status");
        Loan loan = new Loan().tenantId(TenantContext.get()).code("LN-" + String.format("%02d", loans.count() + 8)).direction(LoanDirection.OUT)
            .counterparty(r.getBorrowerName()).principal(r.getAmount()).ratePct(r.getRatePct()).termDays(r.getTermDays()).repaid(M.ZERO)
            .totalDue(r.getAmount().add(M.nz(r.getInterest()))).dueDate(r.getDueDate()).status(LoanStatus.ON_TRACK)
            .escrowJobId((String) res.get("job_id")).escrowStatus(EscrowStatus.valueOf(status)).arcTxHash((String) res.get("tx_hash"))
            .disbursedAt(clock.instant());
        loan = loans.save(loan);
        return ResponseEntity.ok(new LoanApprovalDto().status(EscrowStatusDto.fromValue(status)).jobId((String) res.get("job_id"))
            .txHash((String) res.get("tx_hash")).explorerUrl((String) res.get("explorer_url")).loan(map.loan(loan)).lendableAfter(lendable().getLendable()));
    }

    @Override
    @Transactional
    public ResponseEntity<LoanRequestDto> declineLoanRequest(String stokvelId, String requestId, LoanDeclineDto d) {
        TenantAccessInterceptor.requireTreasurer();
        LoanRequest r = request(requestId);
        if (r.getStatus() != LoanRequestStatus.OPEN) throw new ResponseStatusException(HttpStatus.CONFLICT, "This request is already closed");
        boolean other = d.getReason() == LoanDeclineDto.ReasonEnum.SOMETHING_ELSE;
        if (other && (d.getNote() == null || d.getNote().trim().length() < 3)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tell them the reason in your own words.");
        }
        String reason = other ? d.getNote().trim() : d.getReason().getValue();
        r.status(LoanRequestStatus.DECLINED).declineReason(d.getReason().getValue()).declineNote(d.getNote());
        requests.save(r);
        ledger.record(LedgerEntryType.LOAN_DECLINED, "Declined " + r.getBorrowerName(), r.getBorrowerName(), BigDecimal.ZERO, null,
            "Reason shared with them: " + reason, null, null, clock.instant());
        return ResponseEntity.ok(map.loanRequest(r));
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<List<LoanDto>> listLoans(String stokvelId, LoanDirectionDto direction) {
        List<Loan> list = direction == null ? loans.findAllByOrderByDueDateAsc() : loans.findByDirectionOrderByDueDateAsc(LoanDirection.valueOf(direction.name()));
        return ResponseEntity.ok(list.stream().map(map::loan).toList());
    }
}
