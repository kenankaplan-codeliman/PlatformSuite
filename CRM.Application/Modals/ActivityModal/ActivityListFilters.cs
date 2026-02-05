using CRM.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Modals.ActivityModal;

public class ActivityListFilters
{
    public string? Subject { get; set; }
    public ActivityType? ActivityType { get; set; }
    public ActivityStatus? Status { get; set; }
    public ActivityPriority? Priority { get; set; }
    public EntityType? RegardingEntityType { get; set; }
    public Guid? RegardingEntityId { get; set; }
    public DateTime? DueDateFrom { get; set; }
    public DateTime? DueDateTo { get; set; }
    public Guid? OwnerId { get; set; }
    public bool? IsActive { get; set; }
}
