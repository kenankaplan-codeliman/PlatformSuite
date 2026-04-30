using System.Text.Json.Serialization;

namespace Platform.Domain.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum EntityType
    {
        None, User, Account, Contact
    }
}
