using System;
using System.Collections.Generic;
using System.Text;
using CRM.Application.Modals.Common;
using CRM.Domain.Enums;

namespace CRM.Application.Modals.ActivityModal
{
    public class TaskModal : ActivityBaseModal
    {
        public TaskModal() : base(ActivityType.PhoneCall)
        {
        }

        public string? TaskDescription { get; set; }
        public int PercentComplete { get; set; }
        public DateTime? ReminderAt { get; set; }
    }
}
