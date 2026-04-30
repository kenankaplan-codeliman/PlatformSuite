using System.Text.Json.Serialization;

namespace CodePro.Domain.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum SupplierUserRole
{
    Admin,
    OrderManager,
    Viewer
}
