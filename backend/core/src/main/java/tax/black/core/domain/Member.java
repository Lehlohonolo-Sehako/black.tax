package tax.black.core.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import tax.black.core.domain.enumeration.MandateStatus;
import tax.black.core.domain.enumeration.MemberRole;

/**
 * A Member.
 */
@Entity
@Table(name = "member")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Member implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 64)
    @org.hibernate.annotations.TenantId
    @Column(name = "tenant_id", length = 64, nullable = false)
    private String tenantId;

    @NotNull
    @Size(max = 64)
    @Column(name = "code", length = 64, nullable = false)
    private String code;

    @Column(name = "user_login")
    private String userLogin;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Size(max = 4)
    @Column(name = "initials", length = 4)
    private String initials;

    @Column(name = "phone")
    private String phone;

    @Column(name = "town")
    private String town;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private MemberRole role;

    @NotNull
    @Column(name = "contribution_amount", precision = 21, scale = 2, nullable = false)
    private BigDecimal contributionAmount;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "mandate_status", nullable = false)
    private MandateStatus mandateStatus;

    @Column(name = "mandate_id")
    private String mandateId;

    @Column(name = "mandate_created")
    private LocalDate mandateCreated;

    @Column(name = "recycled_minimum", precision = 21, scale = 2)
    private BigDecimal recycledMinimum;

    @Column(name = "queue_position")
    private Integer queuePosition;

    @Column(name = "projected_clear_month")
    private Integer projectedClearMonth;

    @Column(name = "debit_day")
    private Integer debitDay;

    @Column(name = "removed")
    private Boolean removed;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Member id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTenantId() {
        return this.tenantId;
    }

    public Member tenantId(String tenantId) {
        this.setTenantId(tenantId);
        return this;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getCode() {
        return this.code;
    }

    public Member code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getUserLogin() {
        return this.userLogin;
    }

    public Member userLogin(String userLogin) {
        this.setUserLogin(userLogin);
        return this;
    }

    public void setUserLogin(String userLogin) {
        this.userLogin = userLogin;
    }

    public String getName() {
        return this.name;
    }

    public Member name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getInitials() {
        return this.initials;
    }

    public Member initials(String initials) {
        this.setInitials(initials);
        return this;
    }

    public void setInitials(String initials) {
        this.initials = initials;
    }

    public String getPhone() {
        return this.phone;
    }

    public Member phone(String phone) {
        this.setPhone(phone);
        return this;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getTown() {
        return this.town;
    }

    public Member town(String town) {
        this.setTown(town);
        return this;
    }

    public void setTown(String town) {
        this.town = town;
    }

    public MemberRole getRole() {
        return this.role;
    }

    public Member role(MemberRole role) {
        this.setRole(role);
        return this;
    }

    public void setRole(MemberRole role) {
        this.role = role;
    }

    public BigDecimal getContributionAmount() {
        return this.contributionAmount;
    }

    public Member contributionAmount(BigDecimal contributionAmount) {
        this.setContributionAmount(contributionAmount);
        return this;
    }

    public void setContributionAmount(BigDecimal contributionAmount) {
        this.contributionAmount = contributionAmount;
    }

    public MandateStatus getMandateStatus() {
        return this.mandateStatus;
    }

    public Member mandateStatus(MandateStatus mandateStatus) {
        this.setMandateStatus(mandateStatus);
        return this;
    }

    public void setMandateStatus(MandateStatus mandateStatus) {
        this.mandateStatus = mandateStatus;
    }

    public String getMandateId() {
        return this.mandateId;
    }

    public Member mandateId(String mandateId) {
        this.setMandateId(mandateId);
        return this;
    }

    public void setMandateId(String mandateId) {
        this.mandateId = mandateId;
    }

    public LocalDate getMandateCreated() {
        return this.mandateCreated;
    }

    public Member mandateCreated(LocalDate mandateCreated) {
        this.setMandateCreated(mandateCreated);
        return this;
    }

    public void setMandateCreated(LocalDate mandateCreated) {
        this.mandateCreated = mandateCreated;
    }

    public BigDecimal getRecycledMinimum() {
        return this.recycledMinimum;
    }

    public Member recycledMinimum(BigDecimal recycledMinimum) {
        this.setRecycledMinimum(recycledMinimum);
        return this;
    }

    public void setRecycledMinimum(BigDecimal recycledMinimum) {
        this.recycledMinimum = recycledMinimum;
    }

    public Integer getQueuePosition() {
        return this.queuePosition;
    }

    public Member queuePosition(Integer queuePosition) {
        this.setQueuePosition(queuePosition);
        return this;
    }

    public void setQueuePosition(Integer queuePosition) {
        this.queuePosition = queuePosition;
    }

    public Integer getProjectedClearMonth() {
        return this.projectedClearMonth;
    }

    public Member projectedClearMonth(Integer projectedClearMonth) {
        this.setProjectedClearMonth(projectedClearMonth);
        return this;
    }

    public void setProjectedClearMonth(Integer projectedClearMonth) {
        this.projectedClearMonth = projectedClearMonth;
    }

    public Integer getDebitDay() {
        return this.debitDay;
    }

    public Member debitDay(Integer debitDay) {
        this.setDebitDay(debitDay);
        return this;
    }

    public void setDebitDay(Integer debitDay) {
        this.debitDay = debitDay;
    }

    public Boolean getRemoved() {
        return this.removed;
    }

    public Member removed(Boolean removed) {
        this.setRemoved(removed);
        return this;
    }

    public void setRemoved(Boolean removed) {
        this.removed = removed;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Member)) {
            return false;
        }
        return getId() != null && getId().equals(((Member) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Member{" +
            "id=" + getId() +
            ", tenantId='" + getTenantId() + "'" +
            ", code='" + getCode() + "'" +
            ", userLogin='" + getUserLogin() + "'" +
            ", name='" + getName() + "'" +
            ", initials='" + getInitials() + "'" +
            ", phone='" + getPhone() + "'" +
            ", town='" + getTown() + "'" +
            ", role='" + getRole() + "'" +
            ", contributionAmount=" + getContributionAmount() +
            ", mandateStatus='" + getMandateStatus() + "'" +
            ", mandateId='" + getMandateId() + "'" +
            ", mandateCreated='" + getMandateCreated() + "'" +
            ", recycledMinimum=" + getRecycledMinimum() +
            ", queuePosition=" + getQueuePosition() +
            ", projectedClearMonth=" + getProjectedClearMonth() +
            ", debitDay=" + getDebitDay() +
            ", removed='" + getRemoved() + "'" +
            "}";
    }
}
