package tax.black.core.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import tax.black.core.domain.enumeration.Frequency;
import tax.black.core.domain.enumeration.StokvelType;

/**
 * A stokvel. Its `code` is the tenant id carried by every tenant-owned row.
 */
@Schema(description = "A stokvel. Its `code` is the tenant id carried by every tenant-owned row.")
@Entity
@Table(name = "stokvel")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Stokvel implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 64)
    @Pattern(regexp = "^[a-z0-9_-]+$")
    @Column(name = "code", length = 64, nullable = false, unique = true)
    private String code;

    @NotNull
    @Size(max = 80)
    @Column(name = "name", length = 80, nullable = false)
    private String name;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "stokvel_type", nullable = false)
    private StokvelType stokvelType;

    @NotNull
    @Column(name = "contribution_amount", precision = 21, scale = 2, nullable = false)
    private BigDecimal contributionAmount;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "frequency", nullable = false)
    private Frequency frequency;

    @Column(name = "collection_day")
    private Integer collectionDay;

    @NotNull
    @Column(name = "reserve_floor", precision = 21, scale = 2, nullable = false)
    private BigDecimal reserveFloor;

    @Column(name = "recycling_enabled")
    private Boolean recyclingEnabled;

    @Column(name = "recycling_percentage")
    private Integer recyclingPercentage;

    @Column(name = "recycling_grace_months")
    private Integer recyclingGraceMonths;

    @Column(name = "queue_order")
    private String queueOrder;

    @Column(name = "lending_enabled")
    private Boolean lendingEnabled;

    @Column(name = "lending_cutoff_days")
    private Integer lendingCutoffDays;

    @Column(name = "payout_date")
    private LocalDate payoutDate;

    @Column(name = "target", precision = 21, scale = 2)
    private BigDecimal target;

    @Lob
    @Column(name = "payout_schedule")
    private String payoutSchedule;

    @Column(name = "started_on")
    private LocalDate startedOn;

    @Column(name = "total_months")
    private Integer totalMonths;

    @Column(name = "planned_members")
    private Integer plannedMembers;

    @Column(name = "autonomous")
    private Boolean autonomous;

    @Column(name = "paused")
    private Boolean paused;

    @Column(name = "paused_since")
    private Instant pausedSince;

    @Column(name = "wallet_address")
    private String walletAddress;

    @Column(name = "created_at")
    private Instant createdAt;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Stokvel id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return this.code;
    }

    public Stokvel code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return this.name;
    }

    public Stokvel name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public StokvelType getStokvelType() {
        return this.stokvelType;
    }

    public Stokvel stokvelType(StokvelType stokvelType) {
        this.setStokvelType(stokvelType);
        return this;
    }

    public void setStokvelType(StokvelType stokvelType) {
        this.stokvelType = stokvelType;
    }

    public BigDecimal getContributionAmount() {
        return this.contributionAmount;
    }

    public Stokvel contributionAmount(BigDecimal contributionAmount) {
        this.setContributionAmount(contributionAmount);
        return this;
    }

    public void setContributionAmount(BigDecimal contributionAmount) {
        this.contributionAmount = contributionAmount;
    }

    public Frequency getFrequency() {
        return this.frequency;
    }

    public Stokvel frequency(Frequency frequency) {
        this.setFrequency(frequency);
        return this;
    }

    public void setFrequency(Frequency frequency) {
        this.frequency = frequency;
    }

    public Integer getCollectionDay() {
        return this.collectionDay;
    }

    public Stokvel collectionDay(Integer collectionDay) {
        this.setCollectionDay(collectionDay);
        return this;
    }

    public void setCollectionDay(Integer collectionDay) {
        this.collectionDay = collectionDay;
    }

    public BigDecimal getReserveFloor() {
        return this.reserveFloor;
    }

    public Stokvel reserveFloor(BigDecimal reserveFloor) {
        this.setReserveFloor(reserveFloor);
        return this;
    }

    public void setReserveFloor(BigDecimal reserveFloor) {
        this.reserveFloor = reserveFloor;
    }

    public Boolean getRecyclingEnabled() {
        return this.recyclingEnabled;
    }

    public Stokvel recyclingEnabled(Boolean recyclingEnabled) {
        this.setRecyclingEnabled(recyclingEnabled);
        return this;
    }

    public void setRecyclingEnabled(Boolean recyclingEnabled) {
        this.recyclingEnabled = recyclingEnabled;
    }

    public Integer getRecyclingPercentage() {
        return this.recyclingPercentage;
    }

    public Stokvel recyclingPercentage(Integer recyclingPercentage) {
        this.setRecyclingPercentage(recyclingPercentage);
        return this;
    }

    public void setRecyclingPercentage(Integer recyclingPercentage) {
        this.recyclingPercentage = recyclingPercentage;
    }

    public Integer getRecyclingGraceMonths() {
        return this.recyclingGraceMonths;
    }

    public Stokvel recyclingGraceMonths(Integer recyclingGraceMonths) {
        this.setRecyclingGraceMonths(recyclingGraceMonths);
        return this;
    }

    public void setRecyclingGraceMonths(Integer recyclingGraceMonths) {
        this.recyclingGraceMonths = recyclingGraceMonths;
    }

    public String getQueueOrder() {
        return this.queueOrder;
    }

    public Stokvel queueOrder(String queueOrder) {
        this.setQueueOrder(queueOrder);
        return this;
    }

    public void setQueueOrder(String queueOrder) {
        this.queueOrder = queueOrder;
    }

    public Boolean getLendingEnabled() {
        return this.lendingEnabled;
    }

    public Stokvel lendingEnabled(Boolean lendingEnabled) {
        this.setLendingEnabled(lendingEnabled);
        return this;
    }

    public void setLendingEnabled(Boolean lendingEnabled) {
        this.lendingEnabled = lendingEnabled;
    }

    public Integer getLendingCutoffDays() {
        return this.lendingCutoffDays;
    }

    public Stokvel lendingCutoffDays(Integer lendingCutoffDays) {
        this.setLendingCutoffDays(lendingCutoffDays);
        return this;
    }

    public void setLendingCutoffDays(Integer lendingCutoffDays) {
        this.lendingCutoffDays = lendingCutoffDays;
    }

    public LocalDate getPayoutDate() {
        return this.payoutDate;
    }

    public Stokvel payoutDate(LocalDate payoutDate) {
        this.setPayoutDate(payoutDate);
        return this;
    }

    public void setPayoutDate(LocalDate payoutDate) {
        this.payoutDate = payoutDate;
    }

    public BigDecimal getTarget() {
        return this.target;
    }

    public Stokvel target(BigDecimal target) {
        this.setTarget(target);
        return this;
    }

    public void setTarget(BigDecimal target) {
        this.target = target;
    }

    public String getPayoutSchedule() {
        return this.payoutSchedule;
    }

    public Stokvel payoutSchedule(String payoutSchedule) {
        this.setPayoutSchedule(payoutSchedule);
        return this;
    }

    public void setPayoutSchedule(String payoutSchedule) {
        this.payoutSchedule = payoutSchedule;
    }

    public LocalDate getStartedOn() {
        return this.startedOn;
    }

    public Stokvel startedOn(LocalDate startedOn) {
        this.setStartedOn(startedOn);
        return this;
    }

    public void setStartedOn(LocalDate startedOn) {
        this.startedOn = startedOn;
    }

    public Integer getTotalMonths() {
        return this.totalMonths;
    }

    public Stokvel totalMonths(Integer totalMonths) {
        this.setTotalMonths(totalMonths);
        return this;
    }

    public void setTotalMonths(Integer totalMonths) {
        this.totalMonths = totalMonths;
    }

    public Integer getPlannedMembers() {
        return this.plannedMembers;
    }

    public Stokvel plannedMembers(Integer plannedMembers) {
        this.setPlannedMembers(plannedMembers);
        return this;
    }

    public void setPlannedMembers(Integer plannedMembers) {
        this.plannedMembers = plannedMembers;
    }

    public Boolean getAutonomous() {
        return this.autonomous;
    }

    public Stokvel autonomous(Boolean autonomous) {
        this.setAutonomous(autonomous);
        return this;
    }

    public void setAutonomous(Boolean autonomous) {
        this.autonomous = autonomous;
    }

    public Boolean getPaused() {
        return this.paused;
    }

    public Stokvel paused(Boolean paused) {
        this.setPaused(paused);
        return this;
    }

    public void setPaused(Boolean paused) {
        this.paused = paused;
    }

    public Instant getPausedSince() {
        return this.pausedSince;
    }

    public Stokvel pausedSince(Instant pausedSince) {
        this.setPausedSince(pausedSince);
        return this;
    }

    public void setPausedSince(Instant pausedSince) {
        this.pausedSince = pausedSince;
    }

    public String getWalletAddress() {
        return this.walletAddress;
    }

    public Stokvel walletAddress(String walletAddress) {
        this.setWalletAddress(walletAddress);
        return this;
    }

    public void setWalletAddress(String walletAddress) {
        this.walletAddress = walletAddress;
    }

    public Instant getCreatedAt() {
        return this.createdAt;
    }

    public Stokvel createdAt(Instant createdAt) {
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
        if (!(o instanceof Stokvel)) {
            return false;
        }
        return getId() != null && getId().equals(((Stokvel) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Stokvel{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", name='" + getName() + "'" +
            ", stokvelType='" + getStokvelType() + "'" +
            ", contributionAmount=" + getContributionAmount() +
            ", frequency='" + getFrequency() + "'" +
            ", collectionDay=" + getCollectionDay() +
            ", reserveFloor=" + getReserveFloor() +
            ", recyclingEnabled='" + getRecyclingEnabled() + "'" +
            ", recyclingPercentage=" + getRecyclingPercentage() +
            ", recyclingGraceMonths=" + getRecyclingGraceMonths() +
            ", queueOrder='" + getQueueOrder() + "'" +
            ", lendingEnabled='" + getLendingEnabled() + "'" +
            ", lendingCutoffDays=" + getLendingCutoffDays() +
            ", payoutDate='" + getPayoutDate() + "'" +
            ", target=" + getTarget() +
            ", payoutSchedule='" + getPayoutSchedule() + "'" +
            ", startedOn='" + getStartedOn() + "'" +
            ", totalMonths=" + getTotalMonths() +
            ", plannedMembers=" + getPlannedMembers() +
            ", autonomous='" + getAutonomous() + "'" +
            ", paused='" + getPaused() + "'" +
            ", pausedSince='" + getPausedSince() + "'" +
            ", walletAddress='" + getWalletAddress() + "'" +
            ", createdAt='" + getCreatedAt() + "'" +
            "}";
    }
}
