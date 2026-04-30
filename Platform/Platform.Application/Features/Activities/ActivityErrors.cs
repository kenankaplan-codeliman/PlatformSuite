using Platform.Application.Common.Results;

namespace Platform.Application.Features.Activities;

public static class ActivityErrors
{
    public static readonly Error NotFound =
        new("Activity.NotFound", "Aktivite bulunamadı.", ErrorType.NotFound);

    public static readonly Error InvalidType =
        new("Activity.InvalidType", "Geçersiz aktivite türü.", ErrorType.Conflict);

    public static readonly Error InvalidStatus =
        new("Activity.InvalidStatus", "Geçersiz aktivite durumu.", ErrorType.Conflict);
}
