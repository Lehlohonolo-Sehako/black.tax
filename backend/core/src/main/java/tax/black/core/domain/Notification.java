package tax.black.core.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;
import tax.black.core.domain.enumeration.DecisionType;

/**
 * A Notification.
 */
@Entity
@Table(name = "notification")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Notification implements Serializable {

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
    @Column(name = "sent_at", nullable = false)
    private Instant sentAt;

    @NotNull
    @Size(max = 500)
    @Column(name = "text", length = 500, nullable = false)
    private String text;

    @Column(name = "decision_code")
    private String decisionCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "decision_type")
    private DecisionType decisionType;

    @Column(name = "unread")
    private Boolean unread;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Notification id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTenantId() {
        return this.tenantId;
    }

    public Notification tenantId(String tenantId) {
        this.setTenantId(tenantId);
        return this;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public Instant getSentAt() {
        return this.sentAt;
    }

    public Notification sentAt(Instant sentAt) {
        this.setSentAt(sentAt);
        return this;
    }

    public void setSentAt(Instant sentAt) {
        this.sentAt = sentAt;
    }

    public String getText() {
        return this.text;
    }

    public Notification text(String text) {
        this.setText(text);
        return this;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getDecisionCode() {
        return this.decisionCode;
    }

    public Notification decisionCode(String decisionCode) {
        this.setDecisionCode(decisionCode);
        return this;
    }

    public void setDecisionCode(String decisionCode) {
        this.decisionCode = decisionCode;
    }

    public DecisionType getDecisionType() {
        return this.decisionType;
    }

    public Notification decisionType(DecisionType decisionType) {
        this.setDecisionType(decisionType);
        return this;
    }

    public void setDecisionType(DecisionType decisionType) {
        this.decisionType = decisionType;
    }

    public Boolean getUnread() {
        return this.unread;
    }

    public Notification unread(Boolean unread) {
        this.setUnread(unread);
        return this;
    }

    public void setUnread(Boolean unread) {
        this.unread = unread;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Notification)) {
            return false;
        }
        return getId() != null && getId().equals(((Notification) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Notification{" +
            "id=" + getId() +
            ", tenantId='" + getTenantId() + "'" +
            ", sentAt='" + getSentAt() + "'" +
            ", text='" + getText() + "'" +
            ", decisionCode='" + getDecisionCode() + "'" +
            ", decisionType='" + getDecisionType() + "'" +
            ", unread='" + getUnread() + "'" +
            "}";
    }
}
