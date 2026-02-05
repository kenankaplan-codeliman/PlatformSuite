using System.Text.Json.Serialization;

namespace CRM.Domain.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum Direction
{
    Incoming = 0,
    Outgoing = 1
}
