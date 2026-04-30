using System.Text.Json.Serialization;

namespace CodePro.Domain.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum SupplierType
{
    Manufacturer,
    Distributor,
    ServiceProvider,
    Retailer,
    Other
}
