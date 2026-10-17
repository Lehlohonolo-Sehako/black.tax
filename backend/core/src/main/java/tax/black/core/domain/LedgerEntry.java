package tax.black.core.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import tax.black.core.domain.enumeration.LedgerEntryType;

/**
 * Mirror of a Beancount entry, for fast querying. The ledger service holds the record of truth.
 */
@Schema(description = "Mirror of a Beancount entry, for fast querying. The ledger service holds the record of truth.")
@Entity
@Table(name = "ledger_entry")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class LedgerEntry implements Serializable {

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
    @Column(name = "recorded_at", nullable = false)
    private Instant recordedAt;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "entry_type", nullable = false)
    private LedgerEntryType entryType;

    @Column(name = "counterparty")
    private String counterparty;

    @NotNull
    @Column(name = "description", nullable = false)
    private String description;

    @NotNull
    @Column(name = "amount", precision = 21, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(name = "failed_amount", precision = 21, scale = 2)
    private BigDecimal failedAmount;

    @NotNull
    @Column(name = "running_balance", precision = 21, scale = 2, nullable = false)
    private BigDecimal runningBalance;

    @Lob
    @Column(name = "reasoning")
    private String reasoning;

    @Column(name = "decision_code")
    private String decisionCode;

    @Column(name = "arc_tx_hash")
    private String arcTxHash;

    @Lob
    @Column(name = "beancount")
    private String beancount;

    @Column(name = "beancount_hash")
    private String beancountHash;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public LedgerEntry id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTenantId() {
        return this.tenantId;
    }

    public LedgerEntry tenantId(String tenantId) {
        this.setTenantId(tenantId);
        return this;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getCode() {
        return this.code;
    }

    public LedgerEntry code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Instant getRecordedAt() {
        return this.recordedAt;
    }

    public LedgerEntry recordedAt(Instant recordedAt) {
        this.setRecordedAt(recordedAt);
        return this;
    }

    public void setRecordedAt(Instant recordedAt) {
        this.recordedAt = recordedAt;
    }

    public LedgerEntryType getEntryType() {
        return this.entryType;
    }

    public LedgerEntry entryType(LedgerEntryType entryType) {
        this.setEntryType(entryType);
        return this;
    }

    public void setEntryType(LedgerEntryType entryType) {
        this.entryType = entryType;
    }

    public String getCounterparty() {
        return this.counterparty;
    }

    public LedgerEntry counterparty(String counterparty) {
        this.setCounterparty(counterparty);
        return this;
    }

    public void setCounterparty(String counterparty) {
        this.counterparty = counterparty;
    }

    public String getDescription() {
        return this.description;
    }

    public LedgerEntry description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getAmount() {
        return this.amount;
    }

    public LedgerEntry amount(BigDecimal amount) {
        this.setAmount(amount);
        return this;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public BigDecimal getFailedAmount() {
        return this.failedAmount;
    }

    public LedgerEntry failedAmount(BigDecimal failedAmount) {
        this.setFailedAmount(failedAmount);
        return this;
    }

    public void setFailedAmount(BigDecimal failedAmount) {
        this.failedAmount = failedAmount;
    }

    public BigDecimal getRunningBalance() {
        return this.runningBalance;
    }

    public LedgerEntry runningBalance(BigDecimal runningBalance) {
        this.setRunningBalance(runningBalance);
        return this;
    }

    public void setRunningBalance(BigDecimal runningBalance) {
        this.runningBalance = runningBalance;
    }

    public String getReasoning() {
        return this.reasoning;
    }

    public LedgerEntry reasoning(String reasoning) {
        this.setReasoning(reasoning);
        return this;
    }

    public void setReasoning(String reasoning) {
        this.reasoning = reasoning;
    }

    public String getDecisionCode() {
        return this.decisionCode;
    }

    public LedgerEntry decisionCode(String decisionCode) {
        this.setDecisionCode(decisionCode);
        return this;
    }

    public void setDecisionCode(String decisionCode) {
        this.decisionCode = decisionCode;
    }

    public String getArcTxHash() {
        return this.arcTxHash;
    }

    public LedgerEntry arcTxHash(String arcTxHash) {
        this.setArcTxHash(arcTxHash);
        return this;
    }

    public void setArcTxHash(String arcTxHash) {
        this.arcTxHash = arcTxHash;
    }

    public String getBeancount() {
        return this.beancount;
    }

    public LedgerEntry beancount(String beancount) {
        this.setBeancount(beancount);
        return this;
    }

    public void setBeancount(String beancount) {
        this.beancount = beancount;
    }

    public String getBeancountHash() {
        return this.beancountHash;
    }

    public LedgerEntry beancountHash(String beancountHash) {
        this.setBeancountHash(beancountHash);
        return this;
    }

    public void setBeancountHash(String beancountHash) {
        this.beancountHash = beancountHash;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof LedgerEntry)) {
            return false;
        }
        return getId() != null && getId().equals(((LedgerEntry) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LedgerEntry{" +
            "id=" + getId() +
            ", tenantId='" + getTenantId() + "'" +
            ", code='" + getCode() + "'" +
            ", recordedAt='" + getRecordedAt() + "'" +
            ", entryType='" + getEntryType() + "'" +
            ", counterparty='" + getCounterparty() + "'" +
            ", description='" + getDescription() + "'" +
            ", amount=" + getAmount() +
            ", failedAmount=" + getFailedAmount() +
            ", runningBalance=" + getRunningBalance() +
            ", reasoning='" + getReasoning() + "'" +
            ", decisionCode='" + getDecisionCode() + "'" +
            ", arcTxHash='" + getArcTxHash() + "'" +
            ", beancount='" + getBeancount() + "'" +
            ", beancountHash='" + getBeancountHash() + "'" +
            "}";
    }
}
