using CRM.Domain.Entities.Common;
using CRM.Domain.Enums;

namespace CRM.Domain.Entities.Activity;

/// <summary>
/// Activity Aggregate Root - Abstract Base Class
/// Tüm activity tipleri (Email, PhoneCall, Task, Appointment) bu sınıftan türer.
/// </summary>
public abstract class ActivityBase : IBaseEntity, ISoftDeleteEntity, IAuditableEntity, IOwnedEntity
{
    protected ActivityBase() { }
    protected ActivityBase(ActivityType activityType)
    {
        ActivityType = activityType;
    }


    #region IBaseEntity
    public Guid Id { get; set; } = Guid.NewGuid();
    public bool IsActive { get; set; } = true;
    #endregion
    

    #region Core Activity Properties
    /// <summary>
    /// Aktivite başlığı
    /// </summary>
    public required string Subject { get; set; }

    /// <summary>
    /// Aktivite tipi - Türetilen sınıf tarafından belirlenir
    /// </summary>
    public ActivityType ActivityType    {get; protected set;}

    /// <summary>
    /// Aktivite durumu
    /// </summary>
    public ActivityStatus Status { get; set; } = ActivityStatus.NotStarted;

    /// <summary>
    /// Öncelik seviyesi
    /// </summary>
    public ActivityPriority Priority { get; set; } = ActivityPriority.Normal;

    /// <summary>
    /// Baslangic tarihi
    /// </summary>
    public DateTime? StartDate { get; set; }

    /// <summary>
    /// Planlanan bitiş tarihi
    /// </summary>
    public DateTime? DueDate { get; set; }

    /// <summary>
    /// Tamamlanma tarihi
    /// </summary>
    public DateTime? CompletedDate { get; set; }

    /// <summary>
    /// Aktivite süresi
    /// </summary>
    public TimeSpan? Duration { get; set; }

    #endregion

    #region Regarding Entity (Polymorphic Association)
    /// <summary>
    /// İlgili entity tipi (Lead, Account, Contact, Opportunity vb.)
    /// </summary>
    public EntityType? RegardingEntityType { get; set; }

    /// <summary>
    /// İlgili entity ID
    /// </summary>
    public Guid? RegardingEntityId { get; set; }
    #endregion

    #region IAuditableEntity
    public Guid CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public Guid? UpdatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    #endregion

    #region ISoftDeleteEntity
    public bool IsDeleted { get; set; }
    public Guid? DeletedBy { get; set; }
    public DateTime? DeletedAt { get; set; }
    #endregion

    #region IOwnedEntity
    public Guid OwnerId { get; set; }
    public Guid OrganizationId { get; set; }
    #endregion

    #region Domain Methods
    /// <summary>
    /// Aktiviteyi tamamlandı olarak işaretle
    /// </summary>
    public virtual void MarkAsCompleted()
    {
        Status = ActivityStatus.Completed;
        CompletedDate = DateTime.UtcNow;
    }

    /// <summary>
    /// Aktiviteyi iptal et
    /// </summary>
    public virtual void Cancel()
    {
        Status = ActivityStatus.Cancelled;
    }

    #endregion

    #region Navigation Properties
    /// <summary>
    /// Aktivite katılımcıları
    /// </summary>
    public virtual ICollection<ActivityParty> Parties { get; set; } = new List<ActivityParty>();
    #endregion

    #region Party Helper Methods
    /// <summary>
    /// Katılımcı ekle
    /// </summary>
    public void AddParty(ActivityParty party)
    {
        party.ActivityId = Id;
        Parties.Add(party);
    }

    /// <summary>
    /// Belirli tipteki katılımcıları getir
    /// </summary>
    public IEnumerable<ActivityParty> GetPartiesByType(ActivityPartyType partyType)
    {
        return Parties.Where(p => p.PartyType == partyType);
    }

    /// <summary>
    /// Belirli katılımcı tipindeki katılımcıları getir
    /// </summary>
    public IEnumerable<ActivityParty> GetPartiesByParticipantType(ActivityParticipantType participantType)
    {
        return Parties.Where(p => p.ParticipantType == participantType);
    }
    #endregion
}