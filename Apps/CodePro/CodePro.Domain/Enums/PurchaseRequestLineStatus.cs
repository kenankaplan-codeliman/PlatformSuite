using System.Text.Json.Serialization;

namespace CodePro.Domain.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum PurchaseRequestLineStatus
{
    Setup,
    PendingApproval,
    Approved,
    Rejected,
    InPurchasing,
    OrderCreated,
    Completed,
    Cancelled
}
