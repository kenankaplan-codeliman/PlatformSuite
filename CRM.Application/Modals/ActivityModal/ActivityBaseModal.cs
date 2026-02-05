using CRM.Application.Modals.Common;
using CRM.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Modals.ActivityModal
{
    public class ActivityBaseModal
    {
        public ActivityBaseModal(ActivityType activityType) { 
            this.ActivityType = activityType;
        }

        public Guid Id { get; set; } = default!;
        public string Subject { get; set; } = default!;

        public ActivityType ActivityType { get; private set; }
        public ActivityStatus Status { get; set; }
        public ActivityPriority Priority { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? DueDate { get; set; }
        public EntityReference? RegardingEntity { get; set; }

        public EntityReference? Owner { get; set; }

        public bool IsActive { get; set; }

    }

}
