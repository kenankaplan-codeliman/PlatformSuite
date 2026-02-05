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
        public string? Description { get; set; }

        public ActivityType ActivityType { get; private set; }
        public ActivityStatus Status { get; set; }
        public ActivityPriority Priority { get; set; }
        
        public DateTime? StartDate { get; set; }
        public DateTime? DueDate { get; set; }

        public DateTime? CompletedDate { get; set; }


        public EntityType? RegardingEntityType { get; set; }
        public Guid? RegardingEntityId { get; set; }
        public string? OwnerId { get; set; }
        public bool IsActive { get; set; }
        public DateTime? CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }
    }

}
