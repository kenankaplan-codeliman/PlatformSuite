using CRM.Infrastructure.Data.Converters;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.Extensions.Configuration;

namespace CRM.Infrastructure.Data.Configurations;

public static class ConfigureTypeConverter
{
    public static void SetTypeConverter(this ModelConfigurationBuilder builder)
    {
        // UTC DateTime Converter for PostgreSQL
        builder.Properties<DateTime>().HaveConversion<UtcToLocalDateTimeConverter>();


        #region Enum Converters

        /* builder.Properties<ActivityType>().HaveConversion<EnumToStringConverter<ActivityType>>(); */

        // Enum to String Converters (Global)
        var enumTypes = typeof(CRM.Domain.Enums.AccountType) // Domain assembly'den herhangi bir tip
           .Assembly
           .GetTypes()
           .Where(t => t.IsEnum && t.Namespace == "CRM.Domain.Enums");

        foreach (var enumType in enumTypes)
        {
            // EnumToStringConverter<TEnum> generic tipini oluştur
            var converterType = typeof(EnumToStringConverter<>).MakeGenericType(enumType);

            // configurationBuilder.Properties<TEnum>().HaveConversion<EnumToStringConverter<TEnum>>()
            var propertiesMethod = typeof(ModelConfigurationBuilder)
                .GetMethod(nameof(ModelConfigurationBuilder.Properties), Type.EmptyTypes)!
                .MakeGenericMethod(enumType);

            var propertiesBuilder = propertiesMethod.Invoke(builder, null);

            var haveConversionMethod = propertiesBuilder!.GetType()
                .GetMethod(nameof(PropertiesConfigurationBuilder<int>.HaveConversion), 1, Type.EmptyTypes)!
                .MakeGenericMethod(converterType);

            haveConversionMethod.Invoke(propertiesBuilder, null);
        }

        #endregion




    }
}
