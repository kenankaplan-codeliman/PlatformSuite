using CRM.Application.Modals.Common;
using CRM.Domain.Entities.Activity;
using CRM.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Modals.ActivityModal
{
    public class AppointmentActivityModal : ActivityBaseModal
    {
        public AppointmentActivityModal() : base(ActivityType.Appointment) {
        }

        // Organizatör - tek seçim
        public EntityReference? Organizer { get; set; }

        // Katılımcılar - çoklu seçim
        public List<EntityReference>? Attendees { get; set; }

        // Konum bilgileri
        public string? Location { get; set; }

        public bool IsOnline { get; set; }

        public string? MeetingUrl { get; set; }

        // Zaman bilgileri
        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public bool IsAllDay { get; set; }

        // Hatırlatma
        public int? ReminderMinutesBefore { get; set; }

        public bool? ReminderSet { get; set; }

        // Tekrarlama
        public string? RecurrenceRule { get; set; }

        public bool IsRecurring { get; set; }

        public string? RecurringParentId { get; set; }

        // Notlar
        public string? MeetingNotes { get; set; }
    }

}
