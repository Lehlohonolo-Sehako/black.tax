package tax.black.core.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import tax.black.core.domain.enumeration.CreditTier;
import tax.black.core.domain.enumeration.LoanRequestStatus;
import tax.black.core.domain.enumeration.StokvelType;

/**
 * A LoanRequest.
 */
@Entity
@Table(name = "loan_request")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class LoanRequest implements Serializable {

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

    @Column(name = "borrower_code")
    private String borrowerCode;

    @NotNull
    @Column(name = "borrower_name", nullable = false)
    private String borrowerName;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "borrower_type", nullable = false)
    private StokvelType borrowerType;

    @NotNull
    @Column(name = "borrower_members", nullable = false)
    private Integer borrowerMembers;

    @NotNull
    @Column(name = "months_active", nullable = false)
    private Integer monthsActive;

    @Size(max = 12)
    @Column(name = "contribution_record", length = 12)
    private String contributionRecord;

    @Column(name = "prior_loans")
    private Integer priorLoans;

    @Column(name = "prior_defaults")
    private Integer priorDefaults;

    @Column(name = "reserve_balance", precision = 21, scale = 2)
    private BigDecimal reserveBalance;

    @Column(name = "borrower_reserve_floor", precision = 21, scale = 2)
    private BigDecimal borrowerReserveFloor;

    @Column(name = "borrower_wallet")
    private String borrowerWallet;

    @NotNull
    @Column(name = "amount", precision = 21, scale = 2, nullable = false)
    private BigDecimal amount;

    @NotNull
    @Column(name = "term_days", nullable = false)
    private Integer termDays;

    @NotNull
    @Column(name = "rate_pct", precision = 21, scale = 2, nullable = false)
    private BigDecimal ratePct;

    @Lob
    @Column(name = "purpose")
    private String purpose;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "interest", precision = 21, scale = 2)
    private BigDecimal interest;

    @Column(name = "escrow_address")
    private String escrowAddress;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private LoanRequestStatus status;

    @Column(name = "decline_reason")
    private String declineReason;

    @Column(name = "decline_note")
    private String declineNote;

    @Enumerated(EnumType.STRING)
    @Column(name = "tier")
    private CreditTier tier;

    @Column(name = "recommend")
    private Boolean recommend;

    @Lob
    @Column(name = "reasoning")
    private String reasoning;

    @Column(name = "note")
    private String note;

    @Column(name = "created_at")
    private Instant createdAt;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public LoanRequest id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTenantId() {
        return this.tenantId;
    }

    public LoanRequest tenantId(String tenantId) {
        this.setTenantId(tenantId);
        return this;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getCode() {
        return this.code;
    }

    public LoanRequest code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getBorrowerCode() {
        return this.borrowerCode;
    }

    public LoanRequest borrowerCode(String borrowerCode) {
        this.setBorrowerCode(borrowerCode);
        return this;
    }

    public void setBorrowerCode(String borrowerCode) {
        this.borrowerCode = borrowerCode;
    }

    public String getBorrowerName() {
        return this.borrowerName;
    }

    public LoanRequest borrowerName(String borrowerName) {
        this.setBorrowerName(borrowerName);
        return this;
    }

    public void setBorrowerName(String borrowerName) {
        this.borrowerName = borrowerName;
    }

    public StokvelType getBorrowerType() {
        return this.borrowerType;
    }

    public LoanRequest borrowerType(StokvelType borrowerType) {
        this.setBorrowerType(borrowerType);
        return this;
    }

    public void setBorrowerType(StokvelType borrowerType) {
        this.borrowerType = borrowerType;
    }

    public Integer getBorrowerMembers() {
        return this.borrowerMembers;
    }

    public LoanRequest borrowerMembers(Integer borrowerMembers) {
        this.setBorrowerMembers(borrowerMembers);
        return this;
    }

    public void setBorrowerMembers(Integer borrowerMembers) {
        this.borrowerMembers = borrowerMembers;
    }

    public Integer getMonthsActive() {
        return this.monthsActive;
    }

    public LoanRequest monthsActive(Integer monthsActive) {
        this.setMonthsActive(monthsActive);
        return this;
    }

    public void setMonthsActive(Integer monthsActive) {
        this.monthsActive = monthsActive;
    }

    public String getContributionRecord() {
        return this.contributionRecord;
    }

    public LoanRequest contributionRecord(String contributionRecord) {
        this.setContributionRecord(contributionRecord);
        return this;
    }

    public void setContributionRecord(String contributionRecord) {
        this.contributionRecord = contributionRecord;
    }

    public Integer getPriorLoans() {
        return this.priorLoans;
    }

    public LoanRequest priorLoans(Integer priorLoans) {
        this.setPriorLoans(priorLoans);
        return this;
    }

    public void setPriorLoans(Integer priorLoans) {
        this.priorLoans = priorLoans;
    }

    public Integer getPriorDefaults() {
        return this.priorDefaults;
    }

    public LoanRequest priorDefaults(Integer priorDefaults) {
        this.setPriorDefaults(priorDefaults);
        return this;
    }

    public void setPriorDefaults(Integer priorDefaults) {
        this.priorDefaults = priorDefaults;
    }

    public BigDecimal getReserveBalance() {
        return this.reserveBalance;
    }

    public LoanRequest reserveBalance(BigDecimal reserveBalance) {
        this.setReserveBalance(reserveBalance);
        return this;
    }

    public void setReserveBalance(BigDecimal reserveBalance) {
        this.reserveBalance = reserveBalance;
    }

    public BigDecimal getBorrowerReserveFloor() {
        return this.borrowerReserveFloor;
    }

    public LoanRequest borrowerReserveFloor(BigDecimal borrowerReserveFloor) {
        this.setBorrowerReserveFloor(borrowerReserveFloor);
        return this;
    }

    public void setBorrowerReserveFloor(BigDecimal borrowerReserveFloor) {
        this.borrowerReserveFloor = borrowerReserveFloor;
    }

    public String getBorrowerWallet() {
        return this.borrowerWallet;
    }

    public LoanRequest borrowerWallet(String borrowerWallet) {
        this.setBorrowerWallet(borrowerWallet);
        return this;
    }

    public void setBorrowerWallet(String borrowerWallet) {
        this.borrowerWallet = borrowerWallet;
    }

    public BigDecimal getAmount() {
        return this.amount;
    }

    public LoanRequest amount(BigDecimal amount) {
        this.setAmount(amount);
        return this;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Integer getTermDays() {
        return this.termDays;
    }

    public LoanRequest termDays(Integer termDays) {
        this.setTermDays(termDays);
        return this;
    }

    public void setTermDays(Integer termDays) {
        this.termDays = termDays;
    }

    public BigDecimal getRatePct() {
        return this.ratePct;
    }

    public LoanRequest ratePct(BigDecimal ratePct) {
        this.setRatePct(ratePct);
        return this;
    }

    public void setRatePct(BigDecimal ratePct) {
        this.ratePct = ratePct;
    }

    public String getPurpose() {
        return this.purpose;
    }

    public LoanRequest purpose(String purpose) {
        this.setPurpose(purpose);
        return this;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public LocalDate getDueDate() {
        return this.dueDate;
    }

    public LoanRequest dueDate(LocalDate dueDate) {
        this.setDueDate(dueDate);
        return this;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public BigDecimal getInterest() {
        return this.interest;
    }

    public LoanRequest interest(BigDecimal interest) {
        this.setInterest(interest);
        return this;
    }

    public void setInterest(BigDecimal interest) {
        this.interest = interest;
    }

    public String getEscrowAddress() {
        return this.escrowAddress;
    }

    public LoanRequest escrowAddress(String escrowAddress) {
        this.setEscrowAddress(escrowAddress);
        return this;
    }

    public void setEscrowAddress(String escrowAddress) {
        this.escrowAddress = escrowAddress;
    }

    public LoanRequestStatus getStatus() {
        return this.status;
    }

    public LoanRequest status(LoanRequestStatus status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(LoanRequestStatus status) {
        this.status = status;
    }

    public String getDeclineReason() {
        return this.declineReason;
    }

    public LoanRequest declineReason(String declineReason) {
        this.setDeclineReason(declineReason);
        return this;
    }

    public void setDeclineReason(String declineReason) {
        this.declineReason = declineReason;
    }

    public String getDeclineNote() {
        return this.declineNote;
    }

    public LoanRequest declineNote(String declineNote) {
        this.setDeclineNote(declineNote);
        return this;
    }

    public void setDeclineNote(String declineNote) {
        this.declineNote = declineNote;
    }

    public CreditTier getTier() {
        return this.tier;
    }

    public LoanRequest tier(CreditTier tier) {
        this.setTier(tier);
        return this;
    }

    public void setTier(CreditTier tier) {
        this.tier = tier;
    }

    public Boolean getRecommend() {
        return this.recommend;
    }

    public LoanRequest recommend(Boolean recommend) {
        this.setRecommend(recommend);
        return this;
    }

    public void setRecommend(Boolean recommend) {
        this.recommend = recommend;
    }

    public String getReasoning() {
        return this.reasoning;
    }

    public LoanRequest reasoning(String reasoning) {
        this.setReasoning(reasoning);
        return this;
    }

    public void setReasoning(String reasoning) {
        this.reasoning = reasoning;
    }

    public String getNote() {
        return this.note;
    }

    public LoanRequest note(String note) {
        this.setNote(note);
        return this;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Instant getCreatedAt() {
        return this.createdAt;
    }

    public LoanRequest createdAt(Instant createdAt) {
        this.setCreatedAt(createdAt);
        return this;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof LoanRequest)) {
            return false;
        }
        return getId() != null && getId().equals(((LoanRequest) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LoanRequest{" +
            "id=" + getId() +
            ", tenantId='" + getTenantId() + "'" +
            ", code='" + getCode() + "'" +
            ", borrowerCode='" + getBorrowerCode() + "'" +
            ", borrowerName='" + getBorrowerName() + "'" +
            ", borrowerType='" + getBorrowerType() + "'" +
            ", borrowerMembers=" + getBorrowerMembers() +
            ", monthsActive=" + getMonthsActive() +
            ", contributionRecord='" + getContributionRecord() + "'" +
            ", priorLoans=" + getPriorLoans() +
            ", priorDefaults=" + getPriorDefaults() +
            ", reserveBalance=" + getReserveBalance() +
            ", borrowerReserveFloor=" + getBorrowerReserveFloor() +
            ", borrowerWallet='" + getBorrowerWallet() + "'" +
            ", amount=" + getAmount() +
            ", termDays=" + getTermDays() +
            ", ratePct=" + getRatePct() +
            ", purpose='" + getPurpose() + "'" +
            ", dueDate='" + getDueDate() + "'" +
            ", interest=" + getInterest() +
            ", escrowAddress='" + getEscrowAddress() + "'" +
            ", status='" + getStatus() + "'" +
            ", declineReason='" + getDeclineReason() + "'" +
            ", declineNote='" + getDeclineNote() + "'" +
            ", tier='" + getTier() + "'" +
            ", recommend='" + getRecommend() + "'" +
            ", reasoning='" + getReasoning() + "'" +
            ", note='" + getNote() + "'" +
            ", createdAt='" + getCreatedAt() + "'" +
            "}";
    }
}
