using System.Text.Json.Serialization;

namespace CodePro.Domain.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum PurchaseRequestStatus
{
    Setup,
    PendingApproval,
    InPurchasing,
    PartialOrderCreated,
    OrderCreated,
    Rejected,
    Completed,
    Cancelled
}
