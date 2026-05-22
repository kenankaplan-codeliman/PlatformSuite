using System;
using System.Collections.Generic;
using System.Text;
using Platform.Application.Modals.Common;
using Platform.Domain.Enums;

namespace Platform.Application.Modals.ActivityModal
{
    public class TaskModal : ActivityBaseModal
    {
        public TaskModal() : base(ActivityType.Task)
        {
        }

        public string? TaskDescription { get; set; }
        public bool IsHtml { get; set; }
        public int PercentComplete { get; set; }
        public DateTime? ReminderAt { get; set; }
    }
}
