package tax.black.core.blacktax;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import tax.black.core.domain.Debt;
import tax.black.core.domain.Member;
import tax.black.core.domain.Stokvel;
import tax.black.core.repository.DebtRepository;
import tax.black.core.repository.MemberRepository;
import tax.black.core.repository.StokvelRepository;
import tax.black.core.tenancy.TenantContext;

/** Reads scoped to the current tenant. Hibernate's @TenantId filter is the guarantee; this is convenience. */
@Component
public class Tenant {

    private final StokvelRepository stokvels;
    private final MemberRepository members;
    private final DebtRepository debts;

    public Tenant(StokvelRepository stokvels, MemberRepository members, DebtRepository debts) {
        this.stokvels = stokvels;
        this.members = members;
        this.debts = debts;
    }

    public String id() {
        return TenantContext.get();
    }

    public Stokvel stokvel() {
        return stokvels.findOneByCode(id()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No such stokvel"));
    }

    /** Active roster in queue order (debt-payoff) or join order. */
    public List<Member> members() {
        return members.findByRemovedFalseOrRemovedIsNullOrderByQueuePositionAscIdAsc();
    }

    public Member member(String code) {
        return members
            .findOneByCode(code)
            .filter(m -> !Boolean.TRUE.equals(m.getRemoved()))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No such member"));
    }

    public Map<String, Debt> debtsByMember() {
        Map<String, Debt> map = new HashMap<>();
        for (Debt d : debts.findAll()) map.put(d.getMember().getCode(), d);
        return map;
    }
}
