using CRM.Infrastructure.Data.Converters;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Data.Configurations;

public static class ConfigureTypeConverter
{
    public static void SetTypeConverter(this ModelConfigurationBuilder builder)
    {
        // UTC DateTime Converter for PostgreSQL
        builder.Properties<DateTime>().HaveConversion<UtcToLocalDateTimeConverter>();

        // Enum to String Converters (Global)
        /*
         * Model Builder e tasindi
        builder.Properties<ActivityType>().HaveConversion<EnumToStringConverter<ActivityType>>();
        builder.Properties<ActivityStatus>().HaveConversion<EnumToStringConverter<ActivityStatus>>();
        builder.Properties<ActivityPriority>().HaveConversion<EnumToStringConverter<ActivityPriority>>();
        builder.Properties<CallDirection>().HaveConversion<EnumToStringConverter<CallDirection>>();
        builder.Properties<ActivityPartyType>().HaveConversion<EnumToStringConverter<ActivityPartyType>>();
        builder.Properties<ActivityParticipantType>().HaveConversion<EnumToStringConverter<ActivityParticipantType>>();
        */
    }
}
