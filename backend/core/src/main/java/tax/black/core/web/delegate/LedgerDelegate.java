package tax.black.core.web.delegate;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import tax.black.core.blacktax.M;
import tax.black.core.blacktax.Mappers;
import tax.black.core.blacktax.Tenant;
import tax.black.core.domain.LedgerEntry;
import tax.black.core.repository.LedgerEntryRepository;
import tax.black.core.service.api.dto.LedgerEntryDto;
import tax.black.core.service.api.dto.LedgerEntryTypeDto;
import tax.black.core.service.api.dto.LedgerPageDto;
import tax.black.core.web.api.LedgerApiDelegate;

@Service
@Transactional(readOnly = true)
public class LedgerDelegate implements LedgerApiDelegate {

    private final LedgerEntryRepository entries;
    private final Mappers map;
    private final Tenant tenant;
    private final java.time.Clock clock;

    public LedgerDelegate(LedgerEntryRepository entries, Mappers map, Tenant tenant, java.time.Clock clock) {
        this.entries = entries;
        this.map = map;
        this.tenant = tenant;
        this.clock = clock;
    }

    @Override
    public ResponseEntity<LedgerPageDto> listLedgerEntries(String stokvelId, LocalDate from, LocalDate to, List<LedgerEntryTypeDto> type) {
        List<LedgerEntry> all = entries.findAllByOrderByRecordedAtAscIdAsc();
        var balance = all.isEmpty() ? M.ZERO : all.get(all.size() - 1).getRunningBalance();
        List<LedgerEntryDto> filtered = all.stream()
            .filter(e -> from == null || !e.getRecordedAt().atZone(M.SAST).toLocalDate().isBefore(from))
            .filter(e -> to == null || !e.getRecordedAt().atZone(M.SAST).toLocalDate().isAfter(to))
            .filter(e -> type == null || type.isEmpty() || type.stream().anyMatch(t -> t.name().equals(e.getEntryType().name())))
            .map(map::ledger)
            .toList();
        return ResponseEntity.ok(new LedgerPageDto().balance(M.s(balance)).asOf(OffsetDateTime.now(clock.withZone(M.SAST))).entries(filtered));
    }

    @Override
    public ResponseEntity<LedgerEntryDto> getLedgerEntry(String stokvelId, String entryId) {
        return entries.findOneByCode(entryId).map(map::ledger).map(ResponseEntity::ok)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No such entry"));
    }

    @Override
    public ResponseEntity<String> exportLedger(String stokvelId) {
        StringBuilder csv = new StringBuilder("id,timestamp,type,counterparty,description,amount,failed_amount,running_balance,decision,arc_tx,beancount_hash\n");
        for (LedgerEntry e : entries.findAllByOrderByRecordedAtAscIdAsc()) {
            csv.append(String.join(",", e.getCode(), e.getRecordedAt().atZone(M.SAST).toOffsetDateTime().toString(), e.getEntryType().name(),
                q(e.getCounterparty()), q(e.getDescription()), M.s(e.getAmount()), e.getFailedAmount() == null ? "" : M.s(e.getFailedAmount()),
                M.s(e.getRunningBalance()), q(e.getDecisionCode()), q(e.getArcTxHash()), q(e.getBeancountHash()))).append('\n');
        }
        String file = tenant.id() + "-ledger-" + java.time.YearMonth.now(clock.withZone(M.SAST)) + ".csv";
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file + "\"")
            .header(HttpHeaders.CONTENT_TYPE, "text/csv").body(csv.toString());
    }

    /** CSV cell; leading = + - @ are neutralised so a spreadsheet never evaluates ledger text as a formula. */
    private static String q(String s) {
        if (s == null) return "";
        if (!s.isEmpty() && "=+-@\t\r".indexOf(s.charAt(0)) >= 0) s = "'" + s;
        return "\"" + s.replace("\"", "\"\"") + "\"";
    }
}
