using System.Text.Json.Serialization;

namespace CodePro.Domain.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum SupplierStatus
{
    Pending,
    Active,
    Passive,
    Blacklisted
}
