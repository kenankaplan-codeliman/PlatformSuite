using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Platform.Infrastructure.Data.Converters;

public sealed class UtcToLocalDateTimeConverter : ValueConverter<DateTime, DateTime>
{
    public UtcToLocalDateTimeConverter()
        : base(
            // WRITE → App → DB
            v => v.Kind == DateTimeKind.Utc
                ? v
                : v.ToUniversalTime(),

            // READ → DB → App
            v => DateTime.SpecifyKind(v, DateTimeKind.Utc).ToLocalTime()
        )
    {
    }
}
