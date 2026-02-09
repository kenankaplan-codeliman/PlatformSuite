using System.Text.Json.Serialization;

namespace CRM.Domain.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum Direction
{
    Incoming,
    Outgoing
}
