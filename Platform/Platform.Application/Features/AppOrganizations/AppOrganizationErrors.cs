using Platform.Application.Common.Results;

namespace Platform.Application.Features.AppOrganizations;

public static class AppOrganizationErrors
{
    public static readonly Error NotFound =
        new("Organization.NotFound", "Organizasyon bulunamadı.", ErrorType.NotFound);

    public static readonly Error ParentNotFound =
        new("Organization.ParentNotFound", "Üst organizasyon bulunamadı.", ErrorType.Validation);

    public static readonly Error CircularParent =
        new("Organization.CircularParent", "Organizasyon kendisini parent olarak alamaz.", ErrorType.Validation);
}
