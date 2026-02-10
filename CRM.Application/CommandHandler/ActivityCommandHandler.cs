
using CRM.Application.Exceptions;
using CRM.Application.Interfaces;
using CRM.Application.Modals.ActivityModal;
using CRM.Application.Modals.Common;
using CRM.Domain.Entities.Activity;
using CRM.Domain.Enums;
using System.ComponentModel.Design;
using System.Threading.Tasks;

namespace CRM.Application.CommandHandler;

public class ActivityCommandHandler
{
    private readonly IUnitOfWork unitOfWork;
    private readonly IActivityRepository activityRepository;
    private readonly IReferenceRepository referenceRepository;

    public ActivityCommandHandler(IActivityRepository activityRepository, IUnitOfWork unitOfWork, IReferenceRepository referenceRepository)
    {
        this.activityRepository = activityRepository;
        this.unitOfWork = unitOfWork;
        this.referenceRepository = referenceRepository;
    }

    public async Task<List<ActivityListItem>> Calendar(ActivityListFilters? filters, DateTime startDate, DateTime endDate)
    {
        var result = activityRepository.Calendar(filters, startDate, endDate);

        return result;
    }

    public async Task<ActivityListResponse> List(ActivityListFilters? filters, PaginationInfo? paginationInfo)
    {
        var result = activityRepository.List(filters, paginationInfo);

        return result;
    }


    #region Task

    public async Task<TaskModal> TaskRead(Guid Id)
    {
        var entity = activityRepository.GetTask(Id);

        var modal = MapToTaskModal(entity);

        return modal;
    }

    public async Task<TaskModal> TaskCreate(TaskModal task)
    {
        try
        {
            var entity = MapToTaskEntity(task);

            await unitOfWork.BeginTransactionAsync();

            var createdEntity = activityRepository.CreateTask(entity);

            await unitOfWork.CommitTransactionAsync();

            var createdModal = MapToTaskModal(createdEntity);

            return createdModal;
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task<TaskModal> TaskUpdate(TaskModal task)
    {
        try
        {
            var entity = MapToTaskEntity(task);

            await unitOfWork.BeginTransactionAsync();

            var updatedEntity = activityRepository.UpdateTask(entity);

            await unitOfWork.CommitTransactionAsync();

            var updatedModal = MapToTaskModal(updatedEntity);

            return updatedModal;
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    private TaskActivity MapToTaskEntity(TaskModal modal)
    {
        TaskActivity entity;

        if (modal.Id == Guid.Empty)
            entity = new TaskActivity();
        else
            entity = activityRepository.GetTask(modal.Id);

        SetToActivityBaseEntity(entity, modal);

        entity.TaskDescription = modal.TaskDescription;
        entity.PercentComplete = modal.PercentComplete;
        entity.ReminderAt = modal.ReminderAt;

        return entity;
    }

    private TaskModal MapToTaskModal(TaskActivity entity)
    {
        TaskModal modal = new TaskModal();

        SetActivityBaseModal(modal, entity);

        modal.TaskDescription = entity.TaskDescription;
        modal.PercentComplete = entity.PercentComplete;
        modal.ReminderAt = entity.ReminderAt;

        return modal;
    }

    #endregion

    #region PhoneCall

    public async Task<PhoneCallModal> PhoneCallRead(Guid Id)
    {
        var entity = activityRepository.GetPhoneCall(Id);

        var modal = MapToPhoneCallModal(entity);

        return modal;
    }

    public async Task<PhoneCallModal> PhoneCallCreate(PhoneCallModal phonecall)
    {
        try
        {
            var entity = MapToPhoneCallEntity(phonecall);

            await unitOfWork.BeginTransactionAsync();

            var createdEntity = activityRepository.CreatePhoneCall(entity);

            await unitOfWork.CommitTransactionAsync();

            var createdModal = MapToPhoneCallModal(createdEntity);

            return createdModal;
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task<PhoneCallModal> PhoneCallUpdate(PhoneCallModal phonecall)
    {
        try
        {
            var entity = MapToPhoneCallEntity(phonecall);

            await unitOfWork.BeginTransactionAsync();

            var updatedEntity = activityRepository.UpdatePhoneCall(entity);

            await unitOfWork.CommitTransactionAsync();

            var updatedModal = MapToPhoneCallModal(updatedEntity);

            return updatedModal;
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    private PhoneCall MapToPhoneCallEntity(PhoneCallModal modal)
    {
        PhoneCall entity;

        if (modal.Id == Guid.Empty)
            entity = new PhoneCall();
        else
            entity = activityRepository.GetPhoneCall(modal.Id);

        SetToActivityBaseEntity(entity, modal);

        entity.CallDirection = modal.Direction;
        entity.CallNotes = modal.CallNotes;
        entity.RecordingUrl = modal.RecordingUrl;


        if (modal.Caller != null)
        {
            entity.SetCaller(new ActivityParty
            {
                ParticipantType = Enum.Parse<ActivityParticipantType>(modal.Caller!.EntityType.ToString()),
                ParticipantId = modal.Caller?.Id
            });
        }

        if (modal.Recipient != null)
        {
            entity.SetRecipient(new ActivityParty
            {
                ParticipantType = Enum.Parse<ActivityParticipantType>(modal.Recipient!.EntityType.ToString()),
                ParticipantId = modal.Recipient?.Id
            });
        }

        return entity;

    }

    private PhoneCallModal MapToPhoneCallModal(PhoneCall entity)
    {
        PhoneCallModal modal = new PhoneCallModal();

        SetActivityBaseModal(modal, entity);

        if (entity.Caller != null)
        {
            modal.Caller = referenceRepository.GetReference(
                Enum.Parse<EntityType>(entity.Caller.ParticipantType.ToString()),
                entity.Caller.ParticipantId!.Value);
        }

        if (entity.Recipient != null)
        {
            modal.Recipient = referenceRepository.GetReference(
                Enum.Parse<EntityType>(entity.Recipient.ParticipantType.ToString()),
                entity.Recipient.ParticipantId!.Value);
        }

        modal.Direction = entity.CallDirection;
        modal.CallNotes = entity.CallNotes;
        modal.RecordingUrl = entity.RecordingUrl;

        return modal;
    }

    #endregion

    #region Appointment

    public async Task<AppointmentModal> AppointmentRead(Guid Id)
    {
        var entity = activityRepository.GetAppointment(Id);

        var modal = MapToAppointmentModal(entity);

        return modal;
    }

    public async Task<AppointmentModal> AppointmentCreate(AppointmentModal appointment)
    {
        try
        {
            var entity = MapToAppointmentEntity(appointment);

            await unitOfWork.BeginTransactionAsync();

            var createdEntity = activityRepository.CreateAppointment(entity);

            await unitOfWork.CommitTransactionAsync();

            var createdModal = MapToAppointmentModal(createdEntity);

            return createdModal;
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }


    public async Task<AppointmentModal> AppointmentUpdate(AppointmentModal appointment)
    {
        try
        {
            var entity = MapToAppointmentEntity(appointment);

            await unitOfWork.BeginTransactionAsync();

            var updatedEntity = activityRepository.UpdateAppointment(entity);

            await unitOfWork.CommitTransactionAsync();

            var updatedModal = MapToAppointmentModal(updatedEntity);

            return updatedModal;
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }


    private AppointmentModal MapToAppointmentModal(Appointment entity)
    {
        AppointmentModal modal = new AppointmentModal();

        SetActivityBaseModal(modal, entity);

        #region Appointment

        modal.Location = entity.Location;
        modal.IsOnline = entity.IsOnline;
        modal.IsAllDay = entity.IsAllDay;
        modal.MeetingNotes = entity.MeetingNotes;
        modal.ReminderMinutesBefore = entity.ReminderMinutesBefore;
        modal.RecurrenceRule = entity.RecurrenceRule;
        modal.IsRecurring = entity.IsRecurring;

        #endregion
        var organizer = entity.Organizer;
        if (organizer != null && organizer.ParticipantType == ActivityParticipantType.User)
        {
            modal.Organizer = referenceRepository.GetReference(EntityType.User, organizer.ParticipantId!.Value);
        }

        var attendeesList = entity.Attendees;

        modal.Attendees = new List<EntityReference>();

        foreach (var attendees in attendeesList)
        {
            EntityReference? entityReference = null;

            if (attendees.ParticipantType == ActivityParticipantType.User && attendees.ParticipantId != null)
            {
                entityReference = referenceRepository.GetReference(EntityType.User, attendees.ParticipantId.Value);
            }
            else if (attendees.ParticipantType == ActivityParticipantType.Account)
            {
                throw new NotImplementedException();

            }
            else if (attendees.ParticipantType == ActivityParticipantType.Contact)
            {
                throw new NotImplementedException();
            }
            else if (attendees.ParticipantType == ActivityParticipantType.External)
            {
                entityReference = new EntityReference(EntityType.None)
                {
                    Name = attendees.Name ?? string.Empty,
                    Email = attendees.Email,
                    Phone = attendees.PhoneNumber,
                };
            }
            else
                throw new BusinessException("Invalid attendees type");

            modal.Attendees.Add(entityReference);
        }

        return modal;
    }

    private Appointment MapToAppointmentEntity(AppointmentModal modal)
    {

        Appointment entity;

        if (modal.Id == Guid.Empty)
            entity = new Appointment();
        else
            entity = activityRepository.GetAppointment(modal.Id);

        SetToActivityBaseEntity(entity, modal);


        #region Appointment


        entity.IsAllDay = modal.IsAllDay;
        entity.MeetingNotes = modal.MeetingNotes;
        entity.ReminderMinutesBefore = modal.ReminderMinutesBefore;
        entity.RecurrenceRule = modal.RecurrenceRule;
        entity.IsRecurring = modal.IsRecurring;

        entity.Location = modal.Location;
        entity.IsOnline = modal.IsOnline;
        entity.MeetingUrl = modal.MeetingUrl;

        if (!string.IsNullOrEmpty(entity.MeetingUrl))
            entity.IsOnline = true;

        #endregion

        #region Organizer & Attendees

        if (modal.Organizer != null)
        {
            entity.SetOrganizer(new ActivityParty
            {
                ParticipantType = Enum.Parse<ActivityParticipantType>(modal.Organizer.EntityType.ToString()),
                ParticipantId = modal.Organizer.Id
            });
        }

        foreach (var attende in modal.Attendees)
        {
            if (entity.Attendees.Any(p => p.ParticipantId == attende.Id))
                continue;

            entity.AddAttendee(new ActivityParty
            {
                ParticipantType = Enum.Parse<ActivityParticipantType>(attende.EntityType.ToString()),
                ParticipantId = attende.Id
            });
        }

        // Remove Not Exist Attendess
        entity.Attendees
            .Where(p => !modal.Attendees.Any(m => m.Id == p.ParticipantId))
            .ToList()
            .ForEach(p => entity.Parties.Remove(p));

        #endregion

        return entity;
    }

    #endregion

    #region Email

    public async Task<EmailModal> EmailRead(Guid Id)
    {
        var entity = activityRepository.GetEmail(Id);

        var modal = MapToEmailModal(entity);

        return modal;
    }

    public async Task<EmailModal> EmailCreate(EmailModal task)
    {
        try
        {
            var entity = MapToEmailEntity(task);

            await unitOfWork.BeginTransactionAsync();

            var createdEntity = activityRepository.CreateEmail(entity);

            await unitOfWork.CommitTransactionAsync();

            var createdModal = MapToEmailModal(createdEntity);

            return createdModal;
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task<EmailModal> EmailUpdate(EmailModal task)
    {
        try
        {
            var entity = MapToEmailEntity(task);

            await unitOfWork.BeginTransactionAsync();

            var updatedEntity = activityRepository.UpdateEmail(entity);

            await unitOfWork.CommitTransactionAsync();

            var updatedModal = MapToEmailModal(updatedEntity);

            return updatedModal;
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    private EmailActivity MapToEmailEntity(EmailModal modal)
    {
        EmailActivity entity;

        if (modal.Id == Guid.Empty)
            entity = new EmailActivity();
        else
            entity = activityRepository.GetEmail(modal.Id);

        SetToActivityBaseEntity(entity, modal);


        entity.SetFrom(new ActivityParty
        {
            ParticipantType = Enum.Parse<ActivityParticipantType>(modal.From.EntityType.ToString()),
            ParticipantId = modal.From.Id
        });

        entity.Body = modal.Body;

        entity.IsHtml = modal.IsHtml;
        entity.IsSent = modal.IsSent;
        entity.IsRead = modal.IsRead;
        entity.ReadDate = modal.ReadDate;


        #region To 
        foreach (var toItem in modal.To)
        {
            if (entity.ToRecipients.Any(p => p.ParticipantId == toItem.Id))
                continue;

            entity.AddTo(new ActivityParty
            {
                ParticipantType = Enum.Parse<ActivityParticipantType>(toItem.EntityType.ToString()),
                ParticipantId = toItem.Id
            });
        }

        // Remove Not Exist
        entity.ToRecipients
            .Where(p => !modal.To.Any(m => m.Id == p.ParticipantId))
            .ToList()
            .ForEach(p => entity.Parties.Remove(p));

        #endregion

        #region Cc
        if (modal.Cc != null)
        {
            foreach (var toItem in modal.Cc)
            {
                if (entity.CcRecipients.Any(p => p.ParticipantId == toItem.Id))
                    continue;

                entity.AddCc(new ActivityParty
                {
                    ParticipantType = Enum.Parse<ActivityParticipantType>(toItem.EntityType.ToString()),
                    ParticipantId = toItem.Id
                });
            }

            // Remove Not Exist
            entity.CcRecipients
                .Where(p => !modal.Cc.Any(m => m.Id == p.ParticipantId))
                .ToList()
                .ForEach(p => entity.Parties.Remove(p));
        }
        else
        {
            entity.CcRecipients
               .ToList()
               .ForEach(p => entity.Parties.Remove(p));
        }
        #endregion

        #region Bcc
        if (modal.Bcc != null)
        {
            foreach (var toItem in modal.Bcc)
            {
                if (entity.BccRecipients.Any(p => p.ParticipantId == toItem.Id))
                    continue;

                entity.AddBcc(new ActivityParty
                {
                    ParticipantType = Enum.Parse<ActivityParticipantType>(toItem.EntityType.ToString()),
                    ParticipantId = toItem.Id
                });
            }

            // Remove Not Exist
            entity.BccRecipients
                .Where(p => !modal.To.Any(m => m.Id == p.ParticipantId))
                .ToList()
                .ForEach(p => entity.Parties.Remove(p));
        }
        else
        {
            entity.BccRecipients
               .ToList()
               .ForEach(p => entity.Parties.Remove(p));
        }
        #endregion


        return entity;
    }

    private EmailModal MapToEmailModal(EmailActivity entity)
    {
        EmailModal modal = new EmailModal();

        SetActivityBaseModal(modal, entity);

        modal.Body = entity.Body;

        modal.IsHtml = entity.IsHtml;
        modal.IsSent = entity.IsSent;
        modal.IsRead = entity.IsRead;
        modal.ReadDate = entity.ReadDate;

        if (entity.From != null)
        {
            modal.From = referenceRepository.GetReference(
                   Enum.Parse<EntityType>(entity.From.ParticipantType.ToString()),
                   entity.From.ParticipantId!.Value);
        }

        #region To 

        modal.To = new List<EntityReference>();

        foreach (var item in entity.ToRecipients)
        {
            var entityRef = referenceRepository.GetReference(
                Enum.Parse<EntityType>(item.ParticipantType.ToString()),
                item.ParticipantId!.Value);

            modal.To.Add(entityRef);
        }

        #endregion



        #region Cc

        modal.Cc = new List<EntityReference>();

        foreach (var item in entity.CcRecipients)
        {
            var entityRef = referenceRepository.GetReference(
                Enum.Parse<EntityType>(item.ParticipantType.ToString()),
                item.ParticipantId!.Value);

            modal.Cc.Add(entityRef);
        }

        #endregion

        #region Bcc

        modal.Bcc = new List<EntityReference>();

        foreach (var item in entity.BccRecipients)
        {
            var entityRef = referenceRepository.GetReference(
                Enum.Parse<EntityType>(item.ParticipantType.ToString()),
                item.ParticipantId!.Value);

            modal.Cc.Add(entityRef);
        }

        #endregion


        return modal;
    }

    #endregion

    #region ActivityBase Helper
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
        modal.IsActive = entity.IsActive;
        modal.Subject = entity.Subject;
        modal.Priority = entity.Priority;
        modal.StartDate = entity.StartDate;
        modal.DueDate = entity.DueDate;
        modal.EndDate = entity.EndDate;
        modal.Status = entity.Status;
        if (entity.RegardingEntityType != null && entity.RegardingEntityId != null)
        {
            modal.RegardingEntity = referenceRepository.GetReference(entity.RegardingEntityType.Value, entity.RegardingEntityId.Value);
        }
    }

    #endregion



}
