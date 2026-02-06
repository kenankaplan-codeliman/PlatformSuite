using CRM.Application.Exceptions;
using CRM.Application.Interfaces;
using CRM.Application.Modals.ActivityModal;
using CRM.Application.Modals.Common;
using CRM.Domain.Entities.Activity;
using CRM.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.CommandHandler;

public class AppointmentCommandHandler
{
    private readonly IUnitOfWork unitOfWork;
    private readonly IAppointmentRepository appointmentRepository;
    private readonly IReferenceRepository referenceRepository;

    public AppointmentCommandHandler(
        IUnitOfWork unitOfWork,
        IAppointmentRepository appointmentRepository,
        IReferenceRepository referenceRepository)
    {
        this.appointmentRepository = appointmentRepository;
        this.unitOfWork = unitOfWork;
        this.referenceRepository = referenceRepository;
    }

    public async Task<AppointmentModal> AppointmentRead(Guid Id)
    {
        var entity = appointmentRepository.Get(Id);

        var createdModal = ConvertToModal(entity);

        return createdModal;
    }

    public async Task<AppointmentModal> AppointmentCreate(AppointmentModal appointment)
    {
        try
        {
            Appointment entity = new Appointment();

            SetToEntity(entity, appointment);

            await unitOfWork.BeginTransactionAsync();

            var createdEntity = appointmentRepository.Create(entity);

            await unitOfWork.CommitTransactionAsync();

            var createdModal = ConvertToModal(createdEntity);

            return createdModal;
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }


    public async Task<AppointmentModal> AppointmentUpdate(Guid Id, AppointmentModal appointment)
    {
        try
        {
            var entity = appointmentRepository.Get(Id);

            SetToEntity(entity, appointment);

            await unitOfWork.BeginTransactionAsync();

            var updatedEntity = appointmentRepository.Update(entity);

            await unitOfWork.CommitTransactionAsync();

            var updatedModal = ConvertToModal(updatedEntity);

            return updatedModal;
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }



    private AppointmentModal ConvertToModal(Appointment entity)
    {
        AppointmentModal modal = new AppointmentModal();

        #region ActivityBase
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

        #endregion

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

    private void SetToEntity(Appointment entity, AppointmentModal modal)
    {

        #region ActivityBase

        entity.Subject = modal.Subject;
        entity.Priority = modal.Priority;


        entity.StartDate = modal.StartDate;
        entity.DueDate = modal.DueDate;
        entity.EndDate = modal.EndDate;

        entity.Status = modal.Status;
        //entity.ResolveStatus();

        if (modal.RegardingEntity != null)
        {
            entity.RegardingEntityType = modal.RegardingEntity.EntityType;
            entity.RegardingEntityId = modal.RegardingEntity.Id;
        }

        #endregion

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
            if (entity.Attendees.Any(p=> p.ParticipantId == attende.Id))
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
}

