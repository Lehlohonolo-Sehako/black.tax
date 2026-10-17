package tax.black.core.blacktax;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import tax.black.core.domain.LedgerEntry;
import tax.black.core.domain.enumeration.LedgerEntryType;
import tax.black.core.repository.LedgerEntryRepository;
import tax.black.core.tenancy.TenantContext;

/**
 * Writes money movements: append to Beancount first (the record), then mirror into Postgres with the file hash.
 * If the ledger service refuses or is down, nothing is mirrored and the caller's transaction rolls back.
 */
@Service
public class LedgerService {

    private final LedgerClient ledger;
    private final LedgerEntryRepository entries;

    public LedgerService(LedgerClient ledger, LedgerEntryRepository entries) {
        this.ledger = ledger;
        this.entries = entries;
    }

    public static String prefix(String stokvelId) {
        return switch (stokvelId) {
            case "masakhane" -> "L";
            case "grocery" -> "G";
            default -> stokvelId.isEmpty() ? "X" : stokvelId.substring(0, 1).toUpperCase();
        };
    }

    public String nextCode() {
        String tenant = TenantContext.get();
        String p = prefix(tenant) + "-";
        int max = entries
            .findByTenantId(tenant)
            .stream()
            .map(LedgerEntry::getCode)
            .filter(c -> c.startsWith(p))
            .mapToInt(c -> {
                try {
                    return Integer.parseInt(c.substring(p.length()));
                } catch (NumberFormatException e) {
                    return 0;
                }
            })
            .max()
            .orElse(0);
        return p + String.format("%04d", Math.max(max + 1, "grocery".equals(tenant) ? 101 : 1));
    }

    public BigDecimal balance() {
        // Explicit tenant: a write that starts on the ROOT tenant (e.g. creating a stokvel) must not see another pool.
        return entries.findFirstByTenantIdOrderByRecordedAtDescIdDesc(TenantContext.get()).map(LedgerEntry::getRunningBalance).orElse(M.ZERO);
    }

    /** Double-entry postings for each entry type. `amount` is the signed effect on the pool. */
    public static List<LedgerClient.Posting> postings(LedgerEntryType type, BigDecimal amount, String counterparty) {
        String a = M.s(amount.abs());
        String neg = "-" + a;
        String who = counterparty == null ? "Member" : counterparty.split(" ")[0].replaceAll("[^A-Za-z0-9]", "");
        if (who.isEmpty() || !Character.isLetter(who.charAt(0))) who = "Member";
        who = Character.toUpperCase(who.charAt(0)) + who.substring(1);
        if (amount.signum() == 0) return List.of();
        return switch (type) {
            case CONTRIBUTION -> List.of(new LedgerClient.Posting("Assets:Pool:Cash", a), new LedgerClient.Posting("Equity:Contributions", neg));
            case RECYCLED -> List.of(new LedgerClient.Posting("Assets:Pool:Cash", a), new LedgerClient.Posting("Equity:Recycled", neg));
            case DEBT_PAYMENT, DEBT_CLEARED -> List.of(
                new LedgerClient.Posting("Liabilities:MemberDebt:" + who, a),
                new LedgerClient.Posting("Assets:Pool:Cash", neg)
            );
            case LOAN_OUT -> List.of(new LedgerClient.Posting("Assets:LoansReceivable", a), new LedgerClient.Posting("Assets:Pool:Cash", neg));
            case LOAN_REPAID -> List.of(new LedgerClient.Posting("Assets:Pool:Cash", a), new LedgerClient.Posting("Assets:LoansReceivable", neg));
            default -> List.of();
        };
    }

    public LedgerEntry record(
        LedgerEntryType type,
        String description,
        String counterparty,
        BigDecimal amount,
        BigDecimal failedAmount,
        String reasoning,
        String decisionCode,
        String arcTxHash,
        Instant at
    ) {
        String tenant = TenantContext.get();
        String code = nextCode();
        OffsetDateTime ts = at.atZone(M.SAST).toOffsetDateTime();
        LedgerClient.Appended appended;
        try {
            appended = ledger.append(
                tenant,
                code,
                ts,
                type.name(),
                description,
                postings(type, amount, counterparty),
                type == LedgerEntryType.COLLECTION_FAILED,
                reasoning,
                arcTxHash,
                decisionCode
            );
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "The ledger service didn't accept the entry, so nothing was saved.", e);
        }
        return mirror(code, type, description, counterparty, amount, failedAmount, reasoning, decisionCode, arcTxHash, at,
            appended.beancount(), appended.hash());
    }

    /** Mirror an entry the agent already appended to Beancount. */
    public LedgerEntry mirror(
        String code,
        LedgerEntryType type,
        String description,
        String counterparty,
        BigDecimal amount,
        BigDecimal failedAmount,
        String reasoning,
        String decisionCode,
        String arcTxHash,
        Instant at,
        String beancount,
        String hash
    ) {
        LedgerEntry e = new LedgerEntry()
            .tenantId(TenantContext.get())
            .code(code == null ? nextCode() : code)
            .recordedAt(at)
            .entryType(type)
            .counterparty(counterparty)
            .description(description)
            .amount(M.nz(amount))
            .failedAmount(failedAmount)
            .runningBalance(balance().add(M.nz(amount)))
            .reasoning(reasoning)
            .decisionCode(decisionCode)
            .arcTxHash(arcTxHash)
            .beancount(beancount)
            .beancountHash(hash);
        return entries.save(e);
    }
}
