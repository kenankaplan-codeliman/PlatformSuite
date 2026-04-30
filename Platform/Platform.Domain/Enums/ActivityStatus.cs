using System.Text.Json.Serialization;

namespace Platform.Domain.Enums;

public enum ActivityStatus
{
    NotStarted,
    InProgress,
    Completed,
    Cancelled
}
