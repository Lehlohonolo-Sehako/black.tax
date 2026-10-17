package tax.black.core.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import tax.black.core.domain.enumeration.ContributionStatus;

/**
 * A Contribution.
 */
@Entity
@Table(name = "contribution")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Contribution implements Serializable {

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
    @Size(max = 7)
    @Column(name = "period", length = 7, nullable = false)
    private String period;

    @NotNull
    @Column(name = "amount", precision = 21, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "collected_date")
    private LocalDate collectedDate;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ContributionStatus status;

    @Column(name = "stitch_payment_id")
    private String stitchPaymentId;

    @ManyToOne(optional = false)
    @NotNull
    private Member member;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Contribution id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTenantId() {
        return this.tenantId;
    }

    public Contribution tenantId(String tenantId) {
        this.setTenantId(tenantId);
        return this;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getPeriod() {
        return this.period;
    }

    public Contribution period(String period) {
        this.setPeriod(period);
        return this;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public BigDecimal getAmount() {
        return this.amount;
    }

    public Contribution amount(BigDecimal amount) {
        this.setAmount(amount);
        return this;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDate getDueDate() {
        return this.dueDate;
    }

    public Contribution dueDate(LocalDate dueDate) {
        this.setDueDate(dueDate);
        return this;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDate getCollectedDate() {
        return this.collectedDate;
    }

    public Contribution collectedDate(LocalDate collectedDate) {
        this.setCollectedDate(collectedDate);
        return this;
    }

    public void setCollectedDate(LocalDate collectedDate) {
        this.collectedDate = collectedDate;
    }

    public ContributionStatus getStatus() {
        return this.status;
    }

    public Contribution status(ContributionStatus status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(ContributionStatus status) {
        this.status = status;
    }

    public String getStitchPaymentId() {
        return this.stitchPaymentId;
    }

    public Contribution stitchPaymentId(String stitchPaymentId) {
        this.setStitchPaymentId(stitchPaymentId);
        return this;
    }

    public void setStitchPaymentId(String stitchPaymentId) {
        this.stitchPaymentId = stitchPaymentId;
    }

    public Member getMember() {
        return this.member;
    }

    public void setMember(Member member) {
        this.member = member;
    }

    public Contribution member(Member member) {
        this.setMember(member);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Contribution)) {
            return false;
        }
        return getId() != null && getId().equals(((Contribution) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Contribution{" +
            "id=" + getId() +
            ", tenantId='" + getTenantId() + "'" +
            ", period='" + getPeriod() + "'" +
            ", amount=" + getAmount() +
            ", dueDate='" + getDueDate() + "'" +
            ", collectedDate='" + getCollectedDate() + "'" +
            ", status='" + getStatus() + "'" +
            ", stitchPaymentId='" + getStitchPaymentId() + "'" +
            "}";
    }
}
