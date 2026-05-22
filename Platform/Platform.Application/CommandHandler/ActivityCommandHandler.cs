using Platform.Application.Common.Attachments;
using Platform.Application.Exceptions;
using Platform.Application.Interfaces;
using Platform.Application.Modals.ActivityModal;
using Platform.Application.Modals.Common;
using Platform.Domain.Entities.Activities;
using Platform.Domain.Entities.Common;
using Platform.Domain.Entities.Identities;
using Platform.Domain.Enums;

namespace Platform.Application.CommandHandler;

public class ActivityCommandHandler
{
    /// <summary>
    /// Attachment polimorfik sahip tipi — alt tür (Task/Email/...) farkı gözetmeksizin
    /// tüm aktiviteler "Activity" olarak ilişkilendirilir; client AttachmentsField'ı da
    /// aynı entityType ile listeler.
    /// </summary>
    private const string ActivityEntityType = "Activity";

    private readonly IUnitOfWork unitOfWork;
    private readonly IReferenceRepository referenceRepository;
    private readonly IActivityRepository activityRepository;
    private readonly IEmailActivityRepository emailActivityRepository;
    private readonly IAppointmentActivityRepository appointmentActivityRepository;
    private readonly ITaskActivityRepository taskActivityRepository;
    private readonly IPhoneCallActivityRepository phoneCallActivityRepository;
    private readonly IAttachmentRepository attachmentRepository;

    public ActivityCommandHandler(
        IUnitOfWork unitOfWork,
        IReferenceRepository referenceRepository,
        IActivityRepository activityRepository,
        IEmailActivityRepository emailActivityRepository,
        IAppointmentActivityRepository appointmentActivityRepository,
        ITaskActivityRepository taskActivityRepository,
        IPhoneCallActivityRepository phoneCallActivityRepository,
        IAttachmentRepository attachmentRepository)
    {
        this.unitOfWork = unitOfWork;
        this.referenceRepository = referenceRepository;
        this.activityRepository = activityRepository;
        this.emailActivityRepository = emailActivityRepository;
        this.appointmentActivityRepository = appointmentActivityRepository;
        this.taskActivityRepository = taskActivityRepository;
        this.phoneCallActivityRepository = phoneCallActivityRepository;
        this.attachmentRepository = attachmentRepository;
    }

    /// <summary>
    /// Pending draft attachment'ları aktiviteyle ilişkilendirir. AssociateAsync
    /// SaveChanges çağırmaz; çağıran metodun açtığı transaction commit edilince
    /// (CommitTransactionAsync) relation'lar da aynı atomik işlemde yazılır.
    /// </summary>
    private async Task AssociateAttachmentsAsync(
        ActivityBaseModal modal, Guid entityId, CancellationToken cancellationToken)
    {
        if (modal.Attachments.Count == 0) return;

        var metadataIds = modal.Attachments.Select(a => a.MetadataId).ToList();
        await attachmentRepository.AssociateAsync(
            metadataIds, entityId, ActivityEntityType, cancellationToken);
    }

    // ── Calendar & List ───────────────────────────────────────────────────

    public async Task<List<ActivityListItem>> Calendar(
        ActivityListFilters filters, DateTime startDate, DateTime endDate,
        CancellationToken cancellationToken = default)
    {
        return await activityRepository.CalendarAsync(filters, startDate, endDate, cancellationToken);
    }

    public async Task<ActivityListResponse> List(
        ActivityListFilters filters, PaginationInfo paginationInfo,
        CancellationToken cancellationToken = default)
    {
        return await activityRepository.ListAsync(filters, paginationInfo, cancellationToken);
    }

    // ── Task ──────────────────────────────────────────────────────────────

    public async Task<TaskModal> TaskRead(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await taskActivityRepository.GetAsync(id, cancellationToken)
            ?? throw new NotFoundException();
        return MapToTaskModal(entity);
    }

    public async Task<TaskModal> TaskCreate(TaskModal task, CancellationToken cancellationToken = default)
    {
        try
        {
            var entity = await MapToTaskEntity(task, cancellationToken);
            await unitOfWork.BeginTransactionAsync();
            var created = await taskActivityRepository.CreateAsync(entity, cancellationToken);
            await AssociateAttachmentsAsync(task, created.Id, cancellationToken);
            await unitOfWork.CommitTransactionAsync();
            return MapToTaskModal(created);
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task<TaskModal> TaskUpdate(TaskModal task, CancellationToken cancellationToken = default)
    {
        try
        {
            var entity = await MapToTaskEntity(task, cancellationToken);
            await unitOfWork.BeginTransactionAsync();
            var updated = await taskActivityRepository.UpdateAsync(entity, cancellationToken);
            await AssociateAttachmentsAsync(task, updated.Id, cancellationToken);
            await unitOfWork.CommitTransactionAsync();
            return MapToTaskModal(updated);
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    private async Task<TaskActivity> MapToTaskEntity(
        TaskModal modal, CancellationToken cancellationToken = default)
    {
        TaskActivity entity = modal.Id == Guid.Empty
            ? new TaskActivity()
            : await taskActivityRepository.GetAsync(modal.Id, cancellationToken)
                ?? throw new NotFoundException();

        SetToActivityBaseEntity(entity, modal);
        entity.TaskDescription = modal.TaskDescription;
        entity.IsHtml = modal.IsHtml;
        entity.PercentComplete = modal.PercentComplete;
        entity.ReminderAt = modal.ReminderAt;
        return entity;
    }

    private TaskModal MapToTaskModal(TaskActivity entity)
    {
        var modal = new TaskModal();
        SetActivityBaseModal(modal, entity);
        modal.TaskDescription = entity.TaskDescription;
        modal.IsHtml = entity.IsHtml;
        modal.PercentComplete = entity.PercentComplete;
        modal.ReminderAt = entity.ReminderAt;
        return modal;
    }

    // ── PhoneCall ─────────────────────────────────────────────────────────

    public async Task<PhoneCallModal> PhoneCallRead(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await phoneCallActivityRepository.GetAsync(id, cancellationToken)
            ?? throw new NotFoundException();
        return MapToPhoneCallModal(entity);
    }

    public async Task<PhoneCallModal> PhoneCallCreate(
        PhoneCallModal phonecall, CancellationToken cancellationToken = default)
    {
        try
        {
            var entity = await MapToPhoneCallEntity(phonecall, cancellationToken);
            await unitOfWork.BeginTransactionAsync();
            var created = await phoneCallActivityRepository.CreateAsync(entity, cancellationToken);
            await AssociateAttachmentsAsync(phonecall, created.Id, cancellationToken);
            await unitOfWork.CommitTransactionAsync();
            return MapToPhoneCallModal(created);
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task<PhoneCallModal> PhoneCallUpdate(
        PhoneCallModal phonecall, CancellationToken cancellationToken = default)
    {
        try
        {
            var entity = await MapToPhoneCallEntity(phonecall, cancellationToken);
            await unitOfWork.BeginTransactionAsync();
            var updated = await phoneCallActivityRepository.UpdateAsync(entity, cancellationToken);
            await AssociateAttachmentsAsync(phonecall, updated.Id, cancellationToken);
            await unitOfWork.CommitTransactionAsync();
            return MapToPhoneCallModal(updated);
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    private async Task<PhoneCallActivity> MapToPhoneCallEntity(
        PhoneCallModal modal, CancellationToken cancellationToken = default)
    {
        PhoneCallActivity entity = modal.Id == Guid.Empty
            ? new PhoneCallActivity()
            : await phoneCallActivityRepository.GetAsync(modal.Id, cancellationToken)
                ?? throw new NotFoundException();

        SetToActivityBaseEntity(entity, modal);
        entity.CallDirection = modal.Direction;
        entity.CallNotes = modal.CallNotes;
        entity.IsHtml = modal.IsHtml;
        entity.RecordingUrl = modal.RecordingUrl;

        if (modal.Caller != null)
            entity.SetCaller(ToActivityParty(modal.Caller));

        if (modal.Recipient != null)
            entity.SetRecipient(ToActivityParty(modal.Recipient));

        return entity;
    }

    private PhoneCallModal MapToPhoneCallModal(PhoneCallActivity entity)
    {
        var modal = new PhoneCallModal();
        SetActivityBaseModal(modal, entity);

        modal.Caller = ResolvePartyReference(entity.Caller);
        modal.Recipient = ResolvePartyReference(entity.Recipient);

        modal.Direction = entity.CallDirection;
        modal.CallNotes = entity.CallNotes;
        modal.IsHtml = entity.IsHtml;
        modal.RecordingUrl = entity.RecordingUrl;
        return modal;
    }

    // ── Appointment ───────────────────────────────────────────────────────

    public async Task<AppointmentModal> AppointmentRead(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await appointmentActivityRepository.GetAsync(id, cancellationToken)
            ?? throw new NotFoundException();
        return MapToAppointmentModal(entity);
    }

    public async Task<AppointmentModal> AppointmentCreate(
        AppointmentModal appointment, CancellationToken cancellationToken = default)
    {
        try
        {
            var entity = await MapToAppointmentEntity(appointment, cancellationToken);
            await unitOfWork.BeginTransactionAsync();
            var created = await appointmentActivityRepository.CreateAsync(entity, cancellationToken);
            await AssociateAttachmentsAsync(appointment, created.Id, cancellationToken);
            await unitOfWork.CommitTransactionAsync();
            return MapToAppointmentModal(created);
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task<AppointmentModal> AppointmentUpdate(
        AppointmentModal appointment, CancellationToken cancellationToken = default)
    {
        try
        {
            var entity = await MapToAppointmentEntity(appointment, cancellationToken);
            await unitOfWork.BeginTransactionAsync();
            var updated = await appointmentActivityRepository.UpdateAsync(entity, cancellationToken);
            await AssociateAttachmentsAsync(appointment, updated.Id, cancellationToken);
            await unitOfWork.CommitTransactionAsync();
            return MapToAppointmentModal(updated);
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    private async Task<AppointmentActivity> MapToAppointmentEntity(
        AppointmentModal modal, CancellationToken cancellationToken = default)
    {
        AppointmentActivity entity = modal.Id == Guid.Empty
            ? new AppointmentActivity()
            : await appointmentActivityRepository.GetAsync(modal.Id, cancellationToken)
                ?? throw new NotFoundException();

        SetToActivityBaseEntity(entity, modal);
        entity.IsAllDay = modal.IsAllDay;
        entity.MeetingNotes = modal.MeetingNotes;
        entity.IsHtml = modal.IsHtml;
        entity.ReminderMinutesBefore = modal.ReminderMinutesBefore;
        entity.RecurrenceRule = modal.RecurrenceRule;
        entity.IsRecurring = modal.IsRecurring;
        entity.Location = modal.Location;
        entity.IsOnline = modal.IsOnline;
        entity.MeetingUrl = modal.MeetingUrl;

        if (!string.IsNullOrEmpty(entity.MeetingUrl))
            entity.IsOnline = true;

        if (modal.Organizer != null)
            entity.SetOrganizer(ToActivityParty(modal.Organizer));

        SyncPartyList(entity, entity.Attendees, modal.Attendees, entity.AddAttendee);

        return entity;
    }

    private AppointmentModal MapToAppointmentModal(AppointmentActivity entity)
    {
        var modal = new AppointmentModal();
        SetActivityBaseModal(modal, entity);

        modal.Location = entity.Location;
        modal.IsOnline = entity.IsOnline;
        modal.IsAllDay = entity.IsAllDay;
        modal.MeetingNotes = entity.MeetingNotes;
        modal.IsHtml = entity.IsHtml;
        modal.ReminderMinutesBefore = entity.ReminderMinutesBefore;
        modal.RecurrenceRule = entity.RecurrenceRule;
        modal.IsRecurring = entity.IsRecurring;

        modal.Organizer = ResolvePartyReference(entity.Organizer);

        modal.Attendees = entity.Attendees
            .Select(ResolvePartyReference)
            .Where(r => r != null)
            .Select(r => r!)
            .ToList();

        return modal;
    }

    // ── Email ─────────────────────────────────────────────────────────────

    public async Task<EmailModal> EmailRead(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await emailActivityRepository.GetAsync(id, cancellationToken)
            ?? throw new NotFoundException();
        return MapToEmailModal(entity);
    }

    public async Task<EmailModal> EmailCreate(EmailModal email, CancellationToken cancellationToken = default)
    {
        try
        {
            var entity = await MapToEmailEntity(email, cancellationToken);
            await unitOfWork.BeginTransactionAsync();
            var created = await emailActivityRepository.CreateAsync(entity, cancellationToken);
            await AssociateAttachmentsAsync(email, created.Id, cancellationToken);
            await unitOfWork.CommitTransactionAsync();
            return MapToEmailModal(created);
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task<EmailModal> EmailUpdate(EmailModal email, CancellationToken cancellationToken = default)
    {
        try
        {
            var entity = await MapToEmailEntity(email, cancellationToken);
            await unitOfWork.BeginTransactionAsync();
            var updated = await emailActivityRepository.UpdateAsync(entity, cancellationToken);
            await AssociateAttachmentsAsync(email, updated.Id, cancellationToken);
            await unitOfWork.CommitTransactionAsync();
            return MapToEmailModal(updated);
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    private async Task<EmailActivity> MapToEmailEntity(
        EmailModal modal, CancellationToken cancellationToken = default)
    {
        EmailActivity entity = modal.Id == Guid.Empty
            ? new EmailActivity()
            : await emailActivityRepository.GetAsync(modal.Id, cancellationToken)
                ?? throw new NotFoundException();

        SetToActivityBaseEntity(entity, modal);

        if (modal.From != null)
            entity.SetFrom(ToActivityParty(modal.From));

        entity.Body = modal.Body;
        entity.IsHtml = modal.IsHtml;
        entity.IsSent = modal.IsSent;
        entity.IsRead = modal.IsRead;
        entity.ReadDate = modal.ReadDate;

        SyncPartyList(entity, entity.ToRecipients, modal.To, entity.AddTo);
        SyncPartyList(entity, entity.CcRecipients, modal.Cc ?? new List<EntityReference>(), entity.AddCc);
        SyncPartyList(entity, entity.BccRecipients, modal.Bcc ?? new List<EntityReference>(), entity.AddBcc);

        return entity;
    }

    private static void SyncPartyList(
        ActivityBase entity,
        IEnumerable<ActivityParty> existingParties,
        IList<EntityReference> modalItems,
        Action<ActivityParty> addAction)
    {
        var existingList = existingParties.ToList();

        foreach (var item in modalItems)
        {
            if (existingList.Any(p => p.ParticipantEntityId == item.Id))
                continue;
            addAction(ToActivityParty(item));
        }

        existingList
            .Where(p => !modalItems.Any(m => m.Id == p.ParticipantEntityId))
            .ToList()
            .ForEach(p => entity.Parties.Remove(p));
    }

    private EmailModal MapToEmailModal(EmailActivity entity)
    {
        var modal = new EmailModal();
        SetActivityBaseModal(modal, entity);

        modal.Body = entity.Body;
        modal.IsHtml = entity.IsHtml;
        modal.IsSent = entity.IsSent;
        modal.IsRead = entity.IsRead;
        modal.ReadDate = entity.ReadDate;

        modal.From = ResolvePartyReference(entity.From) ?? new EntityReference();

        modal.To = entity.ToRecipients
            .Select(ResolvePartyReference)
            .Where(r => r != null).Select(r => r!)
            .ToList();

        modal.Cc = entity.CcRecipients
            .Select(ResolvePartyReference)
            .Where(r => r != null).Select(r => r!)
            .ToList();

        modal.Bcc = entity.BccRecipients
            .Select(ResolvePartyReference)
            .Where(r => r != null).Select(r => r!)
            .ToList();

        return modal;
    }

    // ── Complete / Cancel / Delete ────────────────────────────────────────

    public async Task<ActivityBaseModal> Complete(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            await unitOfWork.BeginTransactionAsync();
            var result = await ExecuteOnActivity(id, e => e.Completed(), cancellationToken);
            await unitOfWork.CommitTransactionAsync();
            return result;
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task<ActivityBaseModal> Cancel(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            await unitOfWork.BeginTransactionAsync();
            var result = await ExecuteOnActivity(id, e => e.Cancel(), cancellationToken);
            await unitOfWork.CommitTransactionAsync();
            return result;
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task Delete(List<Guid> Ids, CancellationToken cancellationToken = default)
    {
        try
        {
            await unitOfWork.BeginTransactionAsync();

            foreach (var id in Ids)
            {
                var activityType = await activityRepository.GetActivityTypeAsync(id, cancellationToken);
                ActivityBaseModal result = activityType switch
                {
                    ActivityType.Task => MapToTaskModal(
                        await DeleteEntity(taskActivityRepository, id, cancellationToken)),
                    ActivityType.PhoneCall => MapToPhoneCallModal(
                        await DeleteEntity(phoneCallActivityRepository, id, cancellationToken)),
                    ActivityType.Appointment => MapToAppointmentModal(
                        await DeleteEntity(appointmentActivityRepository, id, cancellationToken)),
                    ActivityType.Email => MapToEmailModal(
                        await DeleteEntity(emailActivityRepository, id, cancellationToken)),
                    _ => throw new BusinessException("Invalid activity type")
                };
            }

            await unitOfWork.CommitTransactionAsync();
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    // ── Bulk Operations ───────────────────────────────────────────────────

    public async Task BulkUpdateStatus(
        List<Guid> ids, ActivityStatus status, CancellationToken cancellationToken = default)
    {
        try
        {
            await unitOfWork.BeginTransactionAsync();
            foreach (var id in ids)
            {
                switch (status)
                {
                    case ActivityStatus.Completed:
                        await ExecuteOnActivity(id, e => e.Completed(), cancellationToken);
                        break;
                    case ActivityStatus.Cancelled:
                        await ExecuteOnActivity(id, e => e.Cancel(), cancellationToken);
                        break;
                    case ActivityStatus.NotStarted:
                    case ActivityStatus.InProgress:
                        await ExecuteOnActivity(id, e => e.Status = status, cancellationToken);
                        break;
                    default:
                        throw new BusinessException("Invalid status");
                }
            }
            await unitOfWork.CommitTransactionAsync();
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task AssignAsync(List<Guid> Ids, Guid ownerId)
    {
        try
        {
            await unitOfWork.BeginTransactionAsync();

            await activityRepository.AssignAsync(Ids, ownerId);

            await unitOfWork.CommitTransactionAsync();

        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task SetStateAsync(List<Guid> Ids, bool isActive)
    {
        try
        {
            await unitOfWork.BeginTransactionAsync();

            await activityRepository.SetStateAsync(Ids, isActive);

            await unitOfWork.CommitTransactionAsync();

        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    // ── Private Helpers ───────────────────────────────────────────────────

    private async Task<ActivityBaseModal> ExecuteOnActivity(
        Guid id, Action<ActivityBase> action, CancellationToken cancellationToken)
    {
        var activityType = await activityRepository.GetActivityTypeAsync(id, cancellationToken);
        return activityType switch
        {
            ActivityType.Task => MapToTaskModal(
                await UpdateEntity(taskActivityRepository, id, action, cancellationToken)),
            ActivityType.PhoneCall => MapToPhoneCallModal(
                await UpdateEntity(phoneCallActivityRepository, id, action, cancellationToken)),
            ActivityType.Appointment => MapToAppointmentModal(
                await UpdateEntity(appointmentActivityRepository, id, action, cancellationToken)),
            ActivityType.Email => MapToEmailModal(
                await UpdateEntity(emailActivityRepository, id, action, cancellationToken)),
            _ => throw new BusinessException("Invalid activity type")
        };
    }

    private static async Task<T> UpdateEntity<T>(
        IEntityRepository<T> repository, Guid id,
        Action<ActivityBase> action, CancellationToken cancellationToken)
        where T : ActivityBase, IBaseEntity
    {
        var entity = await repository.GetAsync(id, cancellationToken) ?? throw new NotFoundException();
        action(entity);
        return await repository.UpdateAsync(entity, cancellationToken);
    }

    private static async Task<T> DeleteEntity<T>(
        IEntityRepository<T> repository, Guid id, CancellationToken cancellationToken)
        where T : ActivityBase, IBaseEntity
    {
        var entity = await repository.GetAsync(id, cancellationToken) ?? throw new NotFoundException();
        return await repository.DeleteAsync(entity, cancellationToken);
    }

    /// <summary>
    /// EntityReference (modal) → ActivityParty (entity). EntityType ve Id varsa
    /// polimorfik referans olarak; aksi halde harici (External) katılımcı olarak yazar.
    /// </summary>
    private static ActivityParty ToActivityParty(EntityReference reference)
    {
        var hasEntityRef =
            !string.IsNullOrWhiteSpace(reference.EntityType) && reference.Id != Guid.Empty;

        return new ActivityParty
        {
            ParticipantEntityType = hasEntityRef ? reference.EntityType : null,
            ParticipantEntityId = hasEntityRef ? reference.Id : null,
            Name = reference.Name,
            Email = reference.Email,
            PhoneNumber = reference.Phone,
        };
    }

    /// <summary>
    /// ActivityParty (entity) → EntityReference (modal). Kayıtlı entity ise registry
    /// üzerinden GetReference; aksi halde harici (External) bilgilerden bir EntityReference üretir.
    /// </summary>
    private EntityReference? ResolvePartyReference(ActivityParty? party)
    {
        if (party == null) return null;

        if (!string.IsNullOrEmpty(party.ParticipantEntityType) && party.ParticipantEntityId.HasValue)
        {
            return referenceRepository.GetReference(party.ParticipantEntityType, party.ParticipantEntityId.Value);
        }

        return new EntityReference
        {
            Name = party.Name ?? string.Empty,
            Email = party.Email,
            Phone = party.PhoneNumber,
        };
    }

    private void SetToActivityBaseEntity(ActivityBase entity, ActivityBaseModal modal)
    {
        entity.Subject = modal.Subject;
        entity.Priority = modal.Priority;
        entity.StartDate = modal.StartDate;
        entity.DueDate = modal.DueDate;
        entity.EndDate = modal.EndDate;

        switch (modal.Status)
        {
            case ActivityStatus.Completed:
                entity.Completed();
                break;
            case ActivityStatus.Cancelled:
                entity.Cancel();
                break;
            default:
                entity.Status = modal.Status;
                entity.EndDate = null;
                break;
        }

        if (modal.RegardingEntity != null)
        {
            entity.RegardingEntityType = modal.RegardingEntity.EntityType;
            entity.RegardingEntityId = modal.RegardingEntity.Id;
        }
    }

    private void SetActivityBaseModal(ActivityBaseModal modal, ActivityBase entity)
    {
        modal.Id = entity.Id;
        modal.Subject = entity.Subject;
        modal.Status = entity.Status;
        modal.Priority = entity.Priority;
        modal.StartDate = entity.StartDate;
        modal.DueDate = entity.DueDate;
        modal.EndDate = entity.EndDate;
        modal.IsActive = entity.IsActive;

        if (entity.RegardingEntityType != null && entity.RegardingEntityId != null)
            modal.RegardingEntity = referenceRepository.GetReference(
                entity.RegardingEntityType, entity.RegardingEntityId.Value);

        modal.Owner = referenceRepository.GetReference(nameof(AuthUser), entity.OwnerId);
    }
}
