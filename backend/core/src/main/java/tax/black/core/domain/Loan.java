package tax.black.core.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import tax.black.core.domain.enumeration.EscrowStatus;
import tax.black.core.domain.enumeration.LoanDirection;
import tax.black.core.domain.enumeration.LoanStatus;

/**
 * A Loan.
 */
@Entity
@Table(name = "loan")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Loan implements Serializable {

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

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "direction", nullable = false)
    private LoanDirection direction;

    @NotNull
    @Column(name = "counterparty", nullable = false)
    private String counterparty;

    @NotNull
    @Column(name = "principal", precision = 21, scale = 2, nullable = false)
    private BigDecimal principal;

    @NotNull
    @Column(name = "rate_pct", precision = 21, scale = 2, nullable = false)
    private BigDecimal ratePct;

    @NotNull
    @Column(name = "term_days", nullable = false)
    private Integer termDays;

    @NotNull
    @Column(name = "repaid", precision = 21, scale = 2, nullable = false)
    private BigDecimal repaid;

    @NotNull
    @Column(name = "total_due", precision = 21, scale = 2, nullable = false)
    private BigDecimal totalDue;

    @NotNull
    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private LoanStatus status;

    @Column(name = "escrow_job_id")
    private String escrowJobId;

    @Enumerated(EnumType.STRING)
    @Column(name = "escrow_status")
    private EscrowStatus escrowStatus;

    @Column(name = "arc_tx_hash")
    private String arcTxHash;

    @Column(name = "disbursed_at")
    private Instant disbursedAt;

    @Column(name = "repaid_at")
    private Instant repaidAt;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Loan id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTenantId() {
        return this.tenantId;
    }

    public Loan tenantId(String tenantId) {
        this.setTenantId(tenantId);
        return this;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getCode() {
        return this.code;
    }

    public Loan code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public LoanDirection getDirection() {
        return this.direction;
    }

    public Loan direction(LoanDirection direction) {
        this.setDirection(direction);
        return this;
    }

    public void setDirection(LoanDirection direction) {
        this.direction = direction;
    }

    public String getCounterparty() {
        return this.counterparty;
    }

    public Loan counterparty(String counterparty) {
        this.setCounterparty(counterparty);
        return this;
    }

    public void setCounterparty(String counterparty) {
        this.counterparty = counterparty;
    }

    public BigDecimal getPrincipal() {
        return this.principal;
    }

    public Loan principal(BigDecimal principal) {
        this.setPrincipal(principal);
        return this;
    }

    public void setPrincipal(BigDecimal principal) {
        this.principal = principal;
    }

    public BigDecimal getRatePct() {
        return this.ratePct;
    }

    public Loan ratePct(BigDecimal ratePct) {
        this.setRatePct(ratePct);
        return this;
    }

    public void setRatePct(BigDecimal ratePct) {
        this.ratePct = ratePct;
    }

    public Integer getTermDays() {
        return this.termDays;
    }

    public Loan termDays(Integer termDays) {
        this.setTermDays(termDays);
        return this;
    }

    public void setTermDays(Integer termDays) {
        this.termDays = termDays;
    }

    public BigDecimal getRepaid() {
        return this.repaid;
    }

    public Loan repaid(BigDecimal repaid) {
        this.setRepaid(repaid);
        return this;
    }

    public void setRepaid(BigDecimal repaid) {
        this.repaid = repaid;
    }

    public BigDecimal getTotalDue() {
        return this.totalDue;
    }

    public Loan totalDue(BigDecimal totalDue) {
        this.setTotalDue(totalDue);
        return this;
    }

    public void setTotalDue(BigDecimal totalDue) {
        this.totalDue = totalDue;
    }

    public LocalDate getDueDate() {
        return this.dueDate;
    }

    public Loan dueDate(LocalDate dueDate) {
        this.setDueDate(dueDate);
        return this;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public LoanStatus getStatus() {
        return this.status;
    }

    public Loan status(LoanStatus status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(LoanStatus status) {
        this.status = status;
    }

    public String getEscrowJobId() {
        return this.escrowJobId;
    }

    public Loan escrowJobId(String escrowJobId) {
        this.setEscrowJobId(escrowJobId);
        return this;
    }

    public void setEscrowJobId(String escrowJobId) {
        this.escrowJobId = escrowJobId;
    }

    public EscrowStatus getEscrowStatus() {
        return this.escrowStatus;
    }

    public Loan escrowStatus(EscrowStatus escrowStatus) {
        this.setEscrowStatus(escrowStatus);
        return this;
    }

    public void setEscrowStatus(EscrowStatus escrowStatus) {
        this.escrowStatus = escrowStatus;
    }

    public String getArcTxHash() {
        return this.arcTxHash;
    }

    public Loan arcTxHash(String arcTxHash) {
        this.setArcTxHash(arcTxHash);
        return this;
    }

    public void setArcTxHash(String arcTxHash) {
        this.arcTxHash = arcTxHash;
    }

    public Instant getDisbursedAt() {
        return this.disbursedAt;
    }

    public Loan disbursedAt(Instant disbursedAt) {
        this.setDisbursedAt(disbursedAt);
        return this;
    }

    public void setDisbursedAt(Instant disbursedAt) {
        this.disbursedAt = disbursedAt;
    }

    public Instant getRepaidAt() {
        return this.repaidAt;
    }

    public Loan repaidAt(Instant repaidAt) {
        this.setRepaidAt(repaidAt);
        return this;
    }

    public void setRepaidAt(Instant repaidAt) {
        this.repaidAt = repaidAt;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Loan)) {
            return false;
        }
        return getId() != null && getId().equals(((Loan) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Loan{" +
            "id=" + getId() +
            ", tenantId='" + getTenantId() + "'" +
            ", code='" + getCode() + "'" +
            ", direction='" + getDirection() + "'" +
            ", counterparty='" + getCounterparty() + "'" +
            ", principal=" + getPrincipal() +
            ", ratePct=" + getRatePct() +
            ", termDays=" + getTermDays() +
            ", repaid=" + getRepaid() +
            ", totalDue=" + getTotalDue() +
            ", dueDate='" + getDueDate() + "'" +
            ", status='" + getStatus() + "'" +
            ", escrowJobId='" + getEscrowJobId() + "'" +
            ", escrowStatus='" + getEscrowStatus() + "'" +
            ", arcTxHash='" + getArcTxHash() + "'" +
            ", disbursedAt='" + getDisbursedAt() + "'" +
            ", repaidAt='" + getRepaidAt() + "'" +
            "}";
    }
}
