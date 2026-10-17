package tax.black.core.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import tax.black.core.domain.enumeration.DebtStatus;

/**
 * A Debt.
 */
@Entity
@Table(name = "debt")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Debt implements Serializable {

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

    @Column(name = "creditor")
    private String creditor;

    @NotNull
    @Column(name = "kind", nullable = false)
    private String kind;

    @NotNull
    @Column(name = "start_balance", precision = 21, scale = 2, nullable = false)
    private BigDecimal startBalance;

    @NotNull
    @Column(name = "balance", precision = 21, scale = 2, nullable = false)
    private BigDecimal balance;

    @NotNull
    @Column(name = "interest_rate", precision = 21, scale = 2, nullable = false)
    private BigDecimal interestRate;

    @NotNull
    @Column(name = "minimum_payment", precision = 21, scale = 2, nullable = false)
    private BigDecimal minimumPayment;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private DebtStatus status;

    @Column(name = "cleared_date")
    private LocalDate clearedDate;

    @ManyToOne(optional = false)
    @NotNull
    private Member member;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Debt id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTenantId() {
        return this.tenantId;
    }

    public Debt tenantId(String tenantId) {
        this.setTenantId(tenantId);
        return this;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getCreditor() {
        return this.creditor;
    }

    public Debt creditor(String creditor) {
        this.setCreditor(creditor);
        return this;
    }

    public void setCreditor(String creditor) {
        this.creditor = creditor;
    }

    public String getKind() {
        return this.kind;
    }

    public Debt kind(String kind) {
        this.setKind(kind);
        return this;
    }

    public void setKind(String kind) {
        this.kind = kind;
    }

    public BigDecimal getStartBalance() {
        return this.startBalance;
    }

    public Debt startBalance(BigDecimal startBalance) {
        this.setStartBalance(startBalance);
        return this;
    }

    public void setStartBalance(BigDecimal startBalance) {
        this.startBalance = startBalance;
    }

    public BigDecimal getBalance() {
        return this.balance;
    }

    public Debt balance(BigDecimal balance) {
        this.setBalance(balance);
        return this;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public BigDecimal getInterestRate() {
        return this.interestRate;
    }

    public Debt interestRate(BigDecimal interestRate) {
        this.setInterestRate(interestRate);
        return this;
    }

    public void setInterestRate(BigDecimal interestRate) {
        this.interestRate = interestRate;
    }

    public BigDecimal getMinimumPayment() {
        return this.minimumPayment;
    }

    public Debt minimumPayment(BigDecimal minimumPayment) {
        this.setMinimumPayment(minimumPayment);
        return this;
    }

    public void setMinimumPayment(BigDecimal minimumPayment) {
        this.minimumPayment = minimumPayment;
    }

    public DebtStatus getStatus() {
        return this.status;
    }

    public Debt status(DebtStatus status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(DebtStatus status) {
        this.status = status;
    }

    public LocalDate getClearedDate() {
        return this.clearedDate;
    }

    public Debt clearedDate(LocalDate clearedDate) {
        this.setClearedDate(clearedDate);
        return this;
    }

    public void setClearedDate(LocalDate clearedDate) {
        this.clearedDate = clearedDate;
    }

    public Member getMember() {
        return this.member;
    }

    public void setMember(Member member) {
        this.member = member;
    }

    public Debt member(Member member) {
        this.setMember(member);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Debt)) {
            return false;
        }
        return getId() != null && getId().equals(((Debt) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Debt{" +
            "id=" + getId() +
            ", tenantId='" + getTenantId() + "'" +
            ", creditor='" + getCreditor() + "'" +
            ", kind='" + getKind() + "'" +
            ", startBalance=" + getStartBalance() +
            ", balance=" + getBalance() +
            ", interestRate=" + getInterestRate() +
            ", minimumPayment=" + getMinimumPayment() +
            ", status='" + getStatus() + "'" +
            ", clearedDate='" + getClearedDate() + "'" +
            "}";
    }
}
