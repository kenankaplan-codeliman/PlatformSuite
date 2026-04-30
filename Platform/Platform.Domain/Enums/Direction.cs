using System.Text.Json.Serialization;

namespace Platform.Domain.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum Direction
{
    Incoming,
    Outgoing
}
