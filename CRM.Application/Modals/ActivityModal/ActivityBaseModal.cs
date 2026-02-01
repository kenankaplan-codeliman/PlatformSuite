using CRM.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Modals.ActivityModal
{
    public class ActivityBaseModal
    {
        public Guid Id { get; set; } = default!;
        public string Subject { get; set; } = default!;
        public string? Description { get; set; }

        public ActivityType ActivityType { get; set; }
        public ActivityStatus Status { get; set; }
        public ActivityPriority Priority { get; set; }
        public DateTime? DueDate { get; set; }
        public string? RegardingEntityType { get; set; }
        public string? RegardingEntityId { get; set; }
        public string? OwnerId { get; set; }
        public bool IsActive { get; set; }
        public DateTime? CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }
    }

}
