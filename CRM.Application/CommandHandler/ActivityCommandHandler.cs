
using CRM.Application.Exceptions;
using CRM.Application.Interfaces;
using CRM.Application.Modals.ActivityModal;
using CRM.Application.Modals.Common;
using CRM.Domain.Entities.Activity;
using CRM.Domain.Enums;

namespace CRM.Application.CommandHandler;

public class ActivityCommandHandler
{
    private readonly IUnitOfWork unitOfWork;
    private readonly IActivityRepository activityRepository;
    private readonly IReferenceRepository referenceRepository;

    public ActivityCommandHandler(IActivityRepository activityRepository, IUnitOfWork unitOfWork, IReferenceRepository referenceRepository  )
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

    #region PhoneCall

    public async Task<PhoneCallModal> PhoneCallRead(Guid Id)
    {
        var entity = activityRepository.GetPhoneCall(Id);

        var createdModal = ConvertToPhoneCallModal(entity);

        return createdModal;
    }

    public async Task<PhoneCallModal> PhoneCallCreate(PhoneCallModal phonecall)
    {
        try
        {
            PhoneCall entity = new PhoneCall();

            SetToPhoneCallEntity(entity, phonecall);

            await unitOfWork.BeginTransactionAsync();

            var createdEntity = activityRepository.CreatePhoneCall(entity);

            await unitOfWork.CommitTransactionAsync();

            var createdModal = ConvertToPhoneCallModal(createdEntity);

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
            var entity = activityRepository.GetPhoneCall(phonecall.Id);

            SetToPhoneCallEntity(entity, phonecall);

            await unitOfWork.BeginTransactionAsync();

            var updatedEntity = activityRepository.UpdatePhoneCall(entity);

            await unitOfWork.CommitTransactionAsync();

            var updatedModal = ConvertToPhoneCallModal(updatedEntity);

            return updatedModal;
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    private void SetToPhoneCallEntity(PhoneCall entity, PhoneCallModal modal)
    {
        SetToActivityBaseEntity(entity, modal);

        entity.CallDirection = modal.Direction;
        entity.CallNotes = modal.CallNotes;
        entity.RecordingUrl = modal.RecordingUrl;


        if (modal.Caller != null) {
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

    }

    private PhoneCallModal ConvertToPhoneCallModal(PhoneCall entity)
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

        var createdModal = ConvertToAppointmentModal(entity);

        return createdModal;
    }

    public async Task<AppointmentModal> AppointmentCreate(AppointmentModal appointment)
    {
        try
        {
            Appointment entity = new Appointment();

            SetToAppointmentEntity(entity, appointment);

            await unitOfWork.BeginTransactionAsync();

            var createdEntity = activityRepository.CreateAppointment(entity);

            await unitOfWork.CommitTransactionAsync();

            var createdModal = ConvertToAppointmentModal(createdEntity);

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
            var entity = activityRepository.GetAppointment(appointment.Id);

            SetToAppointmentEntity(entity, appointment);

            await unitOfWork.BeginTransactionAsync();

            var updatedEntity = activityRepository.UpdateAppointment(entity);

            await unitOfWork.CommitTransactionAsync();

            var updatedModal = ConvertToAppointmentModal(updatedEntity);

            return updatedModal;
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }


    private AppointmentModal ConvertToAppointmentModal(Appointment entity)
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

    private void SetToAppointmentEntity(Appointment entity, AppointmentModal modal)
    {
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

        if (modal.Organizer != null && modal.Organizer.EntityType == EntityType.User)
        {
            ActivityParty organizer = ActivityParty.ForUser(entity.Id, modal.Organizer.Id, ActivityPartyType.Organizer);
            entity.SetOrganizer(organizer);
        }

        foreach (var attende in modal.Attendees)
        {
            if (entity.Attendees.Any(p => p.ParticipantId == attende.Id))
                continue;

            ActivityParty activityParty = null;

            if (attende.EntityType == EntityType.User)
            {
                activityParty = ActivityParty.ForUser(entity.Id, attende.Id, ActivityPartyType.Attendee);
            }
            else if (attende.EntityType == EntityType.Account)
            {
                activityParty = ActivityParty.ForAccount(entity.Id, attende.Id, ActivityPartyType.Attendee);
            }
            else if (attende.EntityType == EntityType.Contact)
            {
                activityParty = ActivityParty.ForContact(entity.Id, attende.Id, ActivityPartyType.Attendee);
            }
            else
                throw new BusinessException("Invalid attendees type");

            entity.AddAttendee(activityParty);
        }

        // Remove Not Exist Attendess
        entity.Attendees
            .Where(p => !modal.Attendees.Any(m => m.Id == p.ParticipantId))
            .ToList()
            .ForEach(p => entity.Parties.Remove(p));

        #endregion

        //OwnerId
        //OrganizationId
        //RecurringParentId
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
