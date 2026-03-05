using CRM.Domain.Entities.Common;
using CRM.Domain.Enums;

namespace CRM.Domain.Entities.Activities;

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
    public Guid Id { get; set; }
    public bool IsActive { get; set; } = true;
    #endregion


    #region Core Activity Properties
    /// <summary>
    /// Aktivite başlığı
    /// </summary>
    public string Subject { get; set; } = default!;

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
    /// Bitiş & Tamamlanma tarihi
    /// </summary>
    public DateTime? EndDate { get; set; }

    /// <summary>
    /// Planlanan bitiş tarihi
    /// </summary>
    public DateTime? DueDate { get; set; }

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

    #region Computed Properties

    #region Computed Properties
    /// <summary>
    /// Görüşme süresi (EndedAt - StartedAt)
    /// </summary>
    public TimeSpan? Duration
    {
        get
        {
            if (StartDate.HasValue && EndDate.HasValue)
            {
                return EndDate.Value - StartDate.Value;
            }
            return null;
        }
    }

    #endregion

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
    public Guid OwnerId { get; private set; }
    public Guid OrganizationId { get; private set; }
    #endregion

    #region Domain Methods
    /// <summary>
    /// Aktiviteyi tamamlandı olarak işaretle
    /// </summary>
    public virtual void Completed()
    {
        Status = ActivityStatus.Completed;
        EndDate = DateTime.Now;
    }

    /// <summary>
    /// Aktiviteyi iptal et
    /// </summary>
    public virtual void Cancel()
    {
        EndDate = DateTime.Now;
        Status = ActivityStatus.Cancelled;
    }

    public virtual void ResolveStatus()
    {
        // Manuel set edilen durumlara dokunma
        if (Status is ActivityStatus.Completed or ActivityStatus.Cancelled)
            return;

        Status = ActivityStatus.InProgress;

        var now = DateTime.UtcNow;

        if (StartDate.HasValue && now < StartDate)
            Status = ActivityStatus.NotStarted;

        if (EndDate.HasValue && now > EndDate.Value)
            Status = ActivityStatus.Completed;
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