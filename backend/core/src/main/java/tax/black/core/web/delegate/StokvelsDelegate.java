package tax.black.core.web.delegate;

import java.math.BigDecimal;
import java.time.Clock;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import tax.black.core.blacktax.DashboardService;
import tax.black.core.blacktax.LedgerService;
import tax.black.core.blacktax.M;
import tax.black.core.blacktax.Mappers;
import tax.black.core.blacktax.Tenant;
import tax.black.core.domain.Member;
import tax.black.core.domain.Stokvel;
import tax.black.core.domain.User;
import tax.black.core.domain.enumeration.Frequency;
import tax.black.core.domain.enumeration.LedgerEntryType;
import tax.black.core.domain.enumeration.MandateStatus;
import tax.black.core.domain.enumeration.MemberRole;
import tax.black.core.domain.enumeration.StokvelType;
import tax.black.core.repository.MemberRepository;
import tax.black.core.repository.StokvelRepository;
import tax.black.core.repository.UserRepository;
import tax.black.core.security.SecurityUtils;
import tax.black.core.service.api.dto.*;
import tax.black.core.tenancy.TenantAccessInterceptor;
import tax.black.core.tenancy.TenantContext;
import tax.black.core.web.api.StokvelsApiDelegate;

@Service
public class StokvelsDelegate implements StokvelsApiDelegate {

    private final StokvelRepository stokvels;
    private final MemberRepository members;
    private final UserRepository users;
    private final Tenant tenant;
    private final Mappers map;
    private final DashboardService dashboard;
    private final LedgerService ledger;
    private final Clock clock;

    public StokvelsDelegate(StokvelRepository stokvels, MemberRepository members, UserRepository users, Tenant tenant, Mappers map,
        DashboardService dashboard, LedgerService ledger, Clock clock) {
        this.stokvels = stokvels;
        this.members = members;
        this.users = users;
        this.tenant = tenant;
        this.map = map;
        this.dashboard = dashboard;
        this.ledger = ledger;
        this.clock = clock;
    }

    private String login() {
        return SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }

    private String treasurerName() {
        return users.findOneByLogin(login()).map(u -> (u.getFirstName() + " " + Objects.toString(u.getLastName(), "")).trim()).orElse("Treasurer");
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<List<StokvelListItemDto>> listStokvels() {
        List<StokvelListItemDto> out = new ArrayList<>();
        for (Member m : members.findByUserLogin(login())) {
            if (Boolean.TRUE.equals(m.getRemoved())) continue;
            stokvels.findOneByCode(m.getTenantId()).ifPresent(s -> {
                long count = members.findByTenantId(s.getCode()).stream().filter(x -> !Boolean.TRUE.equals(x.getRemoved())).count();
                boolean invited = m.getMandateStatus() == MandateStatus.PENDING && m.getMandateId() == null && m.getRole() == MemberRole.MEMBER;
                out.add(new StokvelListItemDto().id(s.getCode()).name(s.getName()).type(StokvelTypeDto.fromValue(s.getStokvelType().name()))
                    .memberCount((int) count).contributionAmount(M.s(s.getContributionAmount())).role(RoleDto.fromValue(m.getRole().name()))
                    .status(invited ? StokvelListItemDto.StatusEnum.INVITED : StokvelListItemDto.StatusEnum.ACTIVE));
            });
        }
        return ResponseEntity.ok(out);
    }

    @Override
    @Transactional
    public ResponseEntity<StokvelDto> createStokvel(CreateStokvelRequestDto req) {
        M.amount(req.getContributionAmount(), new BigDecimal("1.00"), "The contribution");
        M.amount(req.getReserveFloor(), BigDecimal.ZERO, "The reserve floor");
        String base = req.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", "");
        if (base.length() > 40) base = base.substring(0, 40);
        if (base.isEmpty()) base = "stokvel";
        String code = base;
        for (int i = 2; stokvels.findOneByCode(code).isPresent(); i++) code = base + "-" + i;
        Stokvel s = new Stokvel().code(code).name(req.getName()).stokvelType(StokvelType.valueOf(req.getType().name()))
            .contributionAmount(M.d(req.getContributionAmount())).frequency(Frequency.valueOf(req.getFrequency().name()))
            .collectionDay(1).reserveFloor(M.d(req.getReserveFloor())).plannedMembers(req.getPlannedMembers())
            .queueOrder(req.getQueueOrder() == null ? "HIGHEST_RATE_FIRST" : req.getQueueOrder().getValue())
            .lendingEnabled(req.getType() != StokvelTypeDto.DEBT_PAYOFF).autonomous(false).paused(false)
            .startedOn(map.today().plusMonths(1).withDayOfMonth(1)).createdAt(clock.instant());
        if (req.getRecycling() != null) {
            s.recyclingEnabled(req.getRecycling().getEnabled())
                .recyclingPercentage(req.getRecycling().getPercentage() == null ? 100 : req.getRecycling().getPercentage().getValue())
                .recyclingGraceMonths(req.getRecycling().getGraceMonths());
        }
        stokvels.save(s);
        User me = users.findOneByLogin(login()).orElseThrow();
        String name = (me.getFirstName() + " " + Objects.toString(me.getLastName(), "")).trim();
        TenantContext.set(code, "TREASURER");
        try {
            members.save(new Member().tenantId(code).code(me.getFirstName().toLowerCase().replaceAll("[^a-z]", "")).userLogin(me.getLogin())
                .name(name).initials(M.initials(name)).phone(M.intl(me.getLogin())).role(MemberRole.TREASURER)
                .contributionAmount(s.getContributionAmount()).mandateStatus(MandateStatus.PENDING).queuePosition(1).removed(false));
            ledger.record(LedgerEntryType.CONSTITUTION_CHANGE, name + " created " + s.getName() + " with a reserve floor of " + M.rand(s.getReserveFloor()),
                name, BigDecimal.ZERO, null, null, null, null, clock.instant());
        } finally {
            TenantContext.clear();
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(map.stokvel(s, 1));
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<StokvelDto> getStokvel(String stokvelId) {
        return ResponseEntity.ok(map.stokvel(tenant.stokvel(), tenant.members().size()));
    }

    @Override
    public ResponseEntity<DashboardDto> getDashboard(String stokvelId) {
        return ResponseEntity.ok(dashboard.dashboard());
    }

    @Override
    @Transactional
    public ResponseEntity<StokvelDto> updateConstitution(String stokvelId, ConstitutionUpdateDto u) {
        TenantAccessInterceptor.requireTreasurer();
        if (u.getContributionAmount() != null) M.amount(u.getContributionAmount(), new BigDecimal("1.00"), "The contribution");
        if (u.getReserveFloor() != null) M.amount(u.getReserveFloor(), BigDecimal.ZERO, "The reserve floor");
        Stokvel s = tenant.stokvel();
        String who = treasurerName();
        List<String> changes = new ArrayList<>();
        if (u.getContributionAmount() != null && M.d(u.getContributionAmount()).compareTo(s.getContributionAmount()) != 0) {
            changes.add("contribution from " + M.rand(s.getContributionAmount()) + " to " + M.rand(M.d(u.getContributionAmount())));
            s.contributionAmount(M.d(u.getContributionAmount()));
        }
        if (u.getReserveFloor() != null && M.d(u.getReserveFloor()).compareTo(s.getReserveFloor()) != 0) {
            changes.add("reserve floor from " + M.rand(s.getReserveFloor()) + " to " + M.rand(M.d(u.getReserveFloor())));
            s.reserveFloor(M.d(u.getReserveFloor()));
        }
        RecyclingDto r = u.getRecycling();
        if (r != null) {
            if (r.getEnabled() != null && !r.getEnabled().equals(s.getRecyclingEnabled())) {
                changes.add("recycling from " + onOff(s.getRecyclingEnabled()) + " to " + onOff(r.getEnabled()));
                s.recyclingEnabled(r.getEnabled());
            }
            if (r.getPercentage() != null && !Integer.valueOf(r.getPercentage().getValue()).equals(s.getRecyclingPercentage())) {
                changes.add("recycling share from " + s.getRecyclingPercentage() + "% to " + r.getPercentage().getValue() + "%");
                s.recyclingPercentage(r.getPercentage().getValue());
            }
            if (r.getGraceMonths() != null && !r.getGraceMonths().equals(s.getRecyclingGraceMonths())) {
                changes.add("grace period from " + s.getRecyclingGraceMonths() + " to " + r.getGraceMonths() + " months");
                s.recyclingGraceMonths(r.getGraceMonths());
            }
        }
        if (u.getAutonomous() != null && !u.getAutonomous().equals(s.getAutonomous())) {
            changes.add("agent mode to " + (u.getAutonomous() ? "autonomous" : "approval"));
            s.autonomous(u.getAutonomous());
        }
        stokvels.save(s);
        for (String c : changes) {
            ledger.record(LedgerEntryType.CONSTITUTION_CHANGE, "Treasurer updated " + c, who, BigDecimal.ZERO, null, null, null, null, clock.instant());
        }
        return ResponseEntity.ok(map.stokvel(s, tenant.members().size()));
    }

    private static String onOff(Boolean b) {
        return Boolean.TRUE.equals(b) ? "on" : "off";
    }

    @Override
    @Transactional
    public ResponseEntity<LedgerEntryDto> requestQueueVote(String stokvelId) {
        TenantAccessInterceptor.requireTreasurer();
        var e = ledger.record(LedgerEntryType.CONSTITUTION_CHANGE, "Treasurer asked members to vote on the queue order", treasurerName(),
            BigDecimal.ZERO, null, "Vote sent by WhatsApp. Members have 7 days to respond.", null, null, clock.instant());
        return ResponseEntity.accepted().body(map.ledger(e));
    }

    @Override
    @Transactional
    public ResponseEntity<LedgerEntryDto> proposeDissolution(String stokvelId, ProposeDissolutionRequestDto req) {
        TenantAccessInterceptor.requireTreasurer();
        Stokvel s = tenant.stokvel();
        if (!s.getName().equals(req.getConfirmName() == null ? null : req.getConfirmName().trim())) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_CONTENT, "Type the stokvel's name exactly to continue.");
        }
        var e = ledger.record(LedgerEntryType.CONSTITUTION_CHANGE, "Treasurer proposed dissolving " + s.getName(), treasurerName(), BigDecimal.ZERO,
            null, "Nothing changes unless 7 in 10 members approve.", null, null, clock.instant());
        return ResponseEntity.accepted().body(map.ledger(e));
    }
}
