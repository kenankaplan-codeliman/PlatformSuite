using System.Text.Json.Serialization;

namespace Platform.Domain.Enums;

/// <summary>
/// Organizasyon birimi türü. Hiyerarşik organizasyon ağacında her birimin tipini belirler.
/// </summary>
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum OrganizationType
{
    EXECUTIVE,
    INTERNAL_SYSTEM,
    DEPARTMENT,
    ADVISORY,
    REGION,
    BRANCH
}
