using System.Text.Json.Serialization;

namespace Platform.Domain.Enums;

public enum ActivityType
{
    Email,
    PhoneCall,
    Task,
    Appointment
}
