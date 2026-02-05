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

    public async Task<AppointmentModal> CreateAppointment(AppointmentModal appointment)
    {
        try
        {
            var entity = ConvertToEntity(appointment);

            unitOfWork.BeginTransaction();

            var createdEntity = appointmentRepository.Create(entity);

            unitOfWork.CommitTransaction();

            var createdModal = ConvertToModal(createdEntity);

            return createdModal;
        }
        catch
        {
            unitOfWork.RollbackTransaction();
            throw;
        }
    }



    public async Task<AppointmentModal> ReadAppointment(Guid Id)
    {
        var entity = appointmentRepository.Get(Id);

        var createdModal = ConvertToModal(entity);

        return createdModal;
    }


    private AppointmentModal ConvertToModal(Appointment entity)
    {
        AppointmentModal modal = new AppointmentModal();

        #region ActivityBase
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
        if (organizer != null) {

            var entityType = Enum.Parse<EntityType>(organizer.ParticipantType.ToString());
            
            modal.Organizer = new EntityReference(entityType)
            {
                Id = organizer.Id,
            };
        }

        var attendeesList = entity.Attendees;

        modal.Attendees = new List<EntityReference>();

        foreach (var attendees in attendeesList)
        {
            EntityReference? entityReference = null; 

            if (attendees.ParticipantType == ActivityParticipantType.User && attendees.ParticipantId!=null)
            {
                entityReference = referenceRepository.GetReference(EntityType.User,attendees.ParticipantId.Value);
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
                    Phone  = attendees.PhoneNumber,
                };
            }
            else
                throw new BusinessException("Invalid attendees type");

            modal.Attendees.Add(entityReference);
        }

        return modal;
    }

    private Appointment ConvertToEntity(AppointmentModal modal)
    {
        Appointment entity = new Appointment();

        #region ActivityBase

        entity.Subject = modal.Subject;
        entity.Priority = modal.Priority;


        entity.StartDate = modal.StartDate;
        entity.DueDate = modal.DueDate;
        entity.EndDate = modal.EndDate;

        entity.ResolveStatus();

        if (modal.RegardingEntity != null) {
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

        if (modal.Attendees != null && modal.Attendees.Count() > 0)
        {
            foreach (var attendees in modal.Attendees)
            {
                ActivityParty activityParty = null;

                if (attendees.EntityType == EntityType.User)
                {
                    activityParty = ActivityParty.ForUser(entity.Id, attendees.Id, ActivityPartyType.Attendee);
                }
                else if (attendees.EntityType == EntityType.Account)
                {
                    activityParty = ActivityParty.ForAccount(entity.Id, attendees.Id, ActivityPartyType.Attendee);
                }
                else if (attendees.EntityType == EntityType.Contact)
                {
                    activityParty = ActivityParty.ForContact(entity.Id, attendees.Id, ActivityPartyType.Attendee);
                }
                else
                    throw new BusinessException("Invalid attendees type");

                entity.AddAttendee(activityParty);
            }
        }

        #endregion

        return entity;


        //OwnerId
        //OrganizationId


        //RecurringParentId
    }
}

