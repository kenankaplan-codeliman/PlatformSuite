using System.Text.Json.Serialization;

namespace Platform.Api.Configuration;

public static class EnumConfiguration
{
    /// <summary>
    /// Tüm enum'ları C# isimleriyle birebir (PascalCase) JSON'a yazar; integer
    /// değer kabul etmez. Frontend zod şemaları PascalCase enum literal'ı bekliyor.
    /// Naming policy bilinçli olarak verilmedi — `[JsonConverter]` attribute'u
    /// olan enum'larla (Direction, DocumentType, EntityType, OrganizationType)
    /// tutarlı davranış için.
    /// </summary>
    public static IMvcBuilder SetJsonOptions(this IMvcBuilder builder)
    {
        builder.AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.Converters.Add(
                new JsonStringEnumConverter(allowIntegerValues: false));
        });

        return builder;
    }
}

