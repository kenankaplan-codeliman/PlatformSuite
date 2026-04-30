using System.Text.Json.Serialization;

namespace CodePro.Domain.Enums;

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
