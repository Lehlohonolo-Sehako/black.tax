package tax.black.core.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;
import tax.black.core.domain.enumeration.AgentOutcome;
import tax.black.core.domain.enumeration.DecisionType;

/**
 * A AgentDecision.
 */
@Entity
@Table(name = "agent_decision")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AgentDecision implements Serializable {

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
    @Column(name = "decided_at", nullable = false)
    private Instant decidedAt;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "decision_type", nullable = false)
    private DecisionType decisionType;

    @Enumerated(EnumType.STRING)
    @Column(name = "outcome_type")
    private AgentOutcome outcomeType;

    @Column(name = "trigger_type")
    private String triggerType;

    @NotNull
    @Size(max = 500)
    @Column(name = "summary", length = 500, nullable = false)
    private String summary;

    @Lob
    @Column(name = "inputs")
    private String inputs;

    @Lob
    @Column(name = "rule_applied")
    private String ruleApplied;

    @Lob
    @Column(name = "outcome")
    private String outcome;

    @Column(name = "ledger_entry_code")
    private String ledgerEntryCode;

    @Column(name = "arc_tx_hash")
    private String arcTxHash;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public AgentDecision id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTenantId() {
        return this.tenantId;
    }

    public AgentDecision tenantId(String tenantId) {
        this.setTenantId(tenantId);
        return this;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getCode() {
        return this.code;
    }

    public AgentDecision code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Instant getDecidedAt() {
        return this.decidedAt;
    }

    public AgentDecision decidedAt(Instant decidedAt) {
        this.setDecidedAt(decidedAt);
        return this;
    }

    public void setDecidedAt(Instant decidedAt) {
        this.decidedAt = decidedAt;
    }

    public DecisionType getDecisionType() {
        return this.decisionType;
    }

    public AgentDecision decisionType(DecisionType decisionType) {
        this.setDecisionType(decisionType);
        return this;
    }

    public void setDecisionType(DecisionType decisionType) {
        this.decisionType = decisionType;
    }

    public AgentOutcome getOutcomeType() {
        return this.outcomeType;
    }

    public AgentDecision outcomeType(AgentOutcome outcomeType) {
        this.setOutcomeType(outcomeType);
        return this;
    }

    public void setOutcomeType(AgentOutcome outcomeType) {
        this.outcomeType = outcomeType;
    }

    public String getTriggerType() {
        return this.triggerType;
    }

    public AgentDecision triggerType(String triggerType) {
        this.setTriggerType(triggerType);
        return this;
    }

    public void setTriggerType(String triggerType) {
        this.triggerType = triggerType;
    }

    public String getSummary() {
        return this.summary;
    }

    public AgentDecision summary(String summary) {
        this.setSummary(summary);
        return this;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getInputs() {
        return this.inputs;
    }

    public AgentDecision inputs(String inputs) {
        this.setInputs(inputs);
        return this;
    }

    public void setInputs(String inputs) {
        this.inputs = inputs;
    }

    public String getRuleApplied() {
        return this.ruleApplied;
    }

    public AgentDecision ruleApplied(String ruleApplied) {
        this.setRuleApplied(ruleApplied);
        return this;
    }

    public void setRuleApplied(String ruleApplied) {
        this.ruleApplied = ruleApplied;
    }

    public String getOutcome() {
        return this.outcome;
    }

    public AgentDecision outcome(String outcome) {
        this.setOutcome(outcome);
        return this;
    }

    public void setOutcome(String outcome) {
        this.outcome = outcome;
    }

    public String getLedgerEntryCode() {
        return this.ledgerEntryCode;
    }

    public AgentDecision ledgerEntryCode(String ledgerEntryCode) {
        this.setLedgerEntryCode(ledgerEntryCode);
        return this;
    }

    public void setLedgerEntryCode(String ledgerEntryCode) {
        this.ledgerEntryCode = ledgerEntryCode;
    }

    public String getArcTxHash() {
        return this.arcTxHash;
    }

    public AgentDecision arcTxHash(String arcTxHash) {
        this.setArcTxHash(arcTxHash);
        return this;
    }

    public void setArcTxHash(String arcTxHash) {
        this.arcTxHash = arcTxHash;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AgentDecision)) {
            return false;
        }
        return getId() != null && getId().equals(((AgentDecision) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AgentDecision{" +
            "id=" + getId() +
            ", tenantId='" + getTenantId() + "'" +
            ", code='" + getCode() + "'" +
            ", decidedAt='" + getDecidedAt() + "'" +
            ", decisionType='" + getDecisionType() + "'" +
            ", outcomeType='" + getOutcomeType() + "'" +
            ", triggerType='" + getTriggerType() + "'" +
            ", summary='" + getSummary() + "'" +
            ", inputs='" + getInputs() + "'" +
            ", ruleApplied='" + getRuleApplied() + "'" +
            ", outcome='" + getOutcome() + "'" +
            ", ledgerEntryCode='" + getLedgerEntryCode() + "'" +
            ", arcTxHash='" + getArcTxHash() + "'" +
            "}";
    }
}
