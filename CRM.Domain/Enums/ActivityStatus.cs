using System.Text.Json.Serialization;

namespace CRM.Domain.Enums;

public enum ActivityStatus
{
    NotStarted,
    InProgress,
    Completed,
    Cancelled
}
