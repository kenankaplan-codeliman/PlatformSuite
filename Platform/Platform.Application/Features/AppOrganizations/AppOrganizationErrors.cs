using Platform.Application.Common.Results;

namespace Platform.Application.Features.AppOrganizations;

public static class AppOrganizationErrors
{
    public static readonly Error NotFound =
        new("AppOrganization.NotFound", "Organizasyon bulunamadı.", ErrorType.NotFound);

    public static readonly Error ParentNotFound =
        new("AppOrganization.ParentNotFound", "Üst organizasyon bulunamadı.", ErrorType.Validation);

    public static readonly Error CircularParent =
        new("AppOrganization.CircularParent", "Organizasyon kendisini parent olarak alamaz.", ErrorType.Validation);
}
