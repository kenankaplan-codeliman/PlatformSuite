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
    public string? RegardingEntityType { get; set; }
    public string? RegardingEntityId { get; set; }
    public DateTime? DueDateFrom { get; set; }
    public DateTime? DueDateTo { get; set; }
    public string? OwnerId { get; set; }
    public bool? IsActive { get; set; }
}
