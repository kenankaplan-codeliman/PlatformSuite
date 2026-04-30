using System.Text.Json.Serialization;

namespace CodePro.Domain.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum PurchaseRequestPriority
{
    Low,
    Medium,
    High,
    Urgent
}
