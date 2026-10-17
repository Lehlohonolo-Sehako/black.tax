package tax.black.core.web.delegate;

import java.math.BigDecimal;
import java.time.Clock;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import tax.black.core.blacktax.LedgerService;
import tax.black.core.blacktax.M;
import tax.black.core.blacktax.Mappers;
import tax.black.core.blacktax.Tenant;
import tax.black.core.blacktax.stitch.StitchGateway;
import tax.black.core.domain.Debt;
import tax.black.core.domain.Member;
import tax.black.core.domain.Stokvel;
import tax.black.core.domain.enumeration.ContributionStatus;
import tax.black.core.domain.enumeration.DebtStatus;
import tax.black.core.domain.enumeration.LedgerEntryType;
import tax.black.core.domain.enumeration.MandateStatus;
import tax.black.core.domain.enumeration.MemberRole;
import tax.black.core.domain.enumeration.StokvelType;
import tax.black.core.repository.ContributionRepository;
import tax.black.core.repository.MemberRepository;
import tax.black.core.repository.StokvelRepository;
import tax.black.core.repository.UserRepository;
import tax.black.core.service.api.dto.*;
import tax.black.core.tenancy.TenantAccessInterceptor;
import tax.black.core.web.api.MembersApiDelegate;

@Service
public class MembersDelegate implements MembersApiDelegate {

    private final Tenant tenant;
    private final MemberRepository members;
    private final ContributionRepository contributions;
    private final StokvelRepository stokvels;
    private final UserRepository users;
    private final Mappers map;
    private final LedgerService ledger;
    private final StitchGateway stitch;
    private final AuthDelegate auth;
    private final Clock clock;

    public MembersDelegate(Tenant tenant, MemberRepository members, ContributionRepository contributions, StokvelRepository stokvels,
        UserRepository users, Mappers map, LedgerService ledger, StitchGateway stitch, AuthDelegate auth, Clock clock) {
        this.tenant = tenant;
        this.members = members;
        this.contributions = contributions;
        this.stokvels = stokvels;
        this.users = users;
        this.map = map;
        this.ledger = ledger;
        this.stitch = stitch;
        this.auth = auth;
        this.clock = clock;
    }

    private String treasurer() {
        return tenant.members().stream().filter(m -> m.getRole() == MemberRole.TREASURER).map(Member::getName).findFirst().orElse("Treasurer");
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<List<MemberDto>> listMembers(String stokvelId) {
        return ResponseEntity.ok(map.roster(tenant.members(), tenant.debtsByMember()));
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<MemberDetailDto> getMember(String stokvelId, String memberId) {
        Member m = tenant.member(memberId);
        Map<String, Debt> debts = tenant.debtsByMember();
        MemberDto base = map.roster(tenant.members(), debts).stream().filter(x -> x.getId().equals(memberId)).findFirst().orElseThrow();
        MemberDetailDto d = new MemberDetailDto();
        d.setId(base.getId());
        d.setUserId(base.getUserId());
        d.setName(base.getName());
        d.setInitials(base.getInitials());
        d.setPhone(base.getPhone());
        d.setRole(base.getRole());
        d.setContributionAmount(base.getContributionAmount());
        d.setMandateStatus(base.getMandateStatus());
        d.setMandateId(base.getMandateId());
        d.setMandateCreated(base.getMandateCreated());
        d.setQueuePosition(base.getQueuePosition());
        d.setQueueStatus(base.getQueueStatus());
        d.setProjectedClearMonth(base.getProjectedClearMonth());
        d.setRecycledMinimum(base.getRecycledMinimum());
        d.setDebt(base.getDebt());
        d.setContributions(contributions.findByMemberCodeOrderByPeriodAsc(m.getCode()).stream().map(map::contribution).toList());
        return ResponseEntity.ok(d);
    }

    @Override
    @Transactional
    public ResponseEntity<MemberDto> updateMemberContribution(String stokvelId, String memberId, UpdateMemberContributionRequestDto req) {
        TenantAccessInterceptor.requireTreasurer();
        Member m = tenant.member(memberId);
        BigDecimal next = M.amount(req.getContributionAmount(), new BigDecimal("1.00"), "The contribution");
        BigDecimal prev = m.getContributionAmount();
        m.contributionAmount(next).mandateStatus(MandateStatus.PENDING);
        members.save(m);
        stitch.requestMandate(tenant.id(), m, next);
        ledger.record(LedgerEntryType.CONSTITUTION_CHANGE, "Treasurer updated " + m.getName() + "’s contribution from " + M.rand(prev) + " to " + M.rand(next),
            treasurer(), BigDecimal.ZERO, null, "DebiCheck needs the member to approve the new amount with their bank.", null, null, clock.instant());
        return ResponseEntity.ok(map.member(m, tenant.debtsByMember().get(m.getCode())));
    }

    @Override
    @Transactional
    public ResponseEntity<MemberDto> pauseMandate(String stokvelId, String memberId) {
        return setMandate(memberId, MandateStatus.PAUSED, "Paused ");
    }

    @Override
    @Transactional
    public ResponseEntity<MemberDto> resumeMandate(String stokvelId, String memberId) {
        return setMandate(memberId, MandateStatus.ACTIVE, "Resumed ");
    }

    private ResponseEntity<MemberDto> setMandate(String memberId, MandateStatus status, String verb) {
        TenantAccessInterceptor.requireTreasurer();
        Member m = tenant.member(memberId);
        m.mandateStatus(status);
        members.save(m);
        ledger.record(LedgerEntryType.CONSTITUTION_CHANGE, verb + m.getName() + "’s mandate", treasurer(), BigDecimal.ZERO, null, null, null, null, clock.instant());
        return ResponseEntity.ok(map.member(m, tenant.debtsByMember().get(m.getCode())));
    }

    @Override
    @Transactional
    public ResponseEntity<MemberRemovalDto> removeMember(String stokvelId, String memberId) {
        TenantAccessInterceptor.requireTreasurer();
        Member m = tenant.member(memberId);
        if (m.getRole() == MemberRole.TREASURER) throw new ResponseStatusException(HttpStatus.CONFLICT, "Hand over the treasurer role before leaving.");
        Stokvel s = tenant.stokvel();
        Debt debt = tenant.debtsByMember().get(m.getCode());
        BigDecimal paidFor = debt == null ? BigDecimal.ZERO : debt.getStartBalance().subtract(debt.getBalance())
            .subtract(debt.getStatus() == DebtStatus.CLEARED ? BigDecimal.ZERO : BigDecimal.ZERO);
        BigDecimal contributed = contributions.findByMemberCodeOrderByPeriodAsc(m.getCode()).stream()
            .filter(c -> c.getStatus() == ContributionStatus.COLLECTED || c.getStatus() == ContributionStatus.RETRIED)
            .map(c -> c.getAmount()).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal owes = paidFor.subtract(contributed).max(BigDecimal.ZERO);
        BigDecimal refund = BigDecimal.ZERO;
        if (s.getStokvelType() == StokvelType.DEBT_PAYOFF) {
            refund = new BigDecimal("500.00");
            s.reserveFloor(s.getReserveFloor().subtract(refund).max(BigDecimal.ZERO));
            stokvels.save(s);
        }
        m.removed(true);
        members.save(m);
        var e = ledger.record(LedgerEntryType.CONSTITUTION_CHANGE, "Treasurer removed " + m.getName(), treasurer(), BigDecimal.ZERO, null,
            "Under rule 4 they owe " + M.rand(owes) + ". Reserve floor now " + M.rand(s.getReserveFloor()) + ".", null, null, clock.instant());
        return ResponseEntity.ok(new MemberRemovalDto().memberId(m.getCode()).owesGroup(M.s(owes)).refunded(M.s(refund))
            .newReserveFloor(M.s(s.getReserveFloor())).ledgerEntry(map.ledger(e)));
    }

    @Override
    @Transactional
    public ResponseEntity<InvitationDto> inviteMember(String stokvelId, InvitationRequestDto req) {
        TenantAccessInterceptor.requireTreasurer();
        String phone = M.digits(req.getPhone());
        if (!phone.matches("0\\d{9}")) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Enter all 10 digits, starting with 0.");
        String name = req.getName().trim();
        String base = name.split(" ")[0].toLowerCase().replaceAll("[^a-z]", "");
        String code = base;
        for (int i = 2; members.findOneByCode(code).isPresent(); i++) code = base + i;
        if (members.findOneByTenantIdAndUserLogin(tenant.id(), phone).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, M.intl(phone) + " is already in this stokvel.");
        }
        M.amount(req.getContributionAmount(), new BigDecimal("1.00"), "The contribution");
        if (name.length() > 80) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Names can be up to 80 characters.");
        if (users.findOneByLogin(phone).isEmpty()) auth.createUser(phone, name);
        int position = tenant.members().stream().mapToInt(x -> x.getQueuePosition() == null ? 0 : x.getQueuePosition()).max().orElse(0) + 1;
        Member m = members.save(new Member().tenantId(tenant.id()).code(code).userLogin(phone).name(name).initials(M.initials(name))
            .phone(M.intl(phone)).role(MemberRole.MEMBER).contributionAmount(M.d(req.getContributionAmount()))
            .mandateStatus(MandateStatus.PENDING).queuePosition(position).debitDay(1).removed(false));
        String link;
        try {
            link = stitch.requestMandate(tenant.id(), m, m.getContributionAmount());
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "We couldn’t send the SMS to " + M.intl(phone) + ". Nothing was saved.", e);
        }
        ledger.record(LedgerEntryType.CONSTITUTION_CHANGE, "Treasurer invited " + name + " at " + M.rand(m.getContributionAmount()) + " a month",
            treasurer(), BigDecimal.ZERO, null, null, null, null, clock.instant());
        return ResponseEntity.status(HttpStatus.CREATED).body(new InvitationDto().member(map.member(m, null)).sentTo(M.intl(phone)).mandateLink(link));
    }
}
