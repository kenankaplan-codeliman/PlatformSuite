using System.Text.Json.Serialization;

namespace CodePro.Domain.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum PurchaseOrderStatus
{
    Draft,
    Submitted,
    Confirmed,
    InDelivery,
    Received,
    Cancelled
}
