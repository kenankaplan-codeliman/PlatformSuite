using Platform.Application.Common.Results;

namespace Platform.Application.Features.AppRoles;

public static class AppRoleErrors
{
    public static readonly Error NotFound =
        new("AppRole.NotFound", "Rol bulunamadı.", ErrorType.NotFound);

    public static readonly Error DuplicateName =
        new("AppRole.DuplicateName", "Aynı isimde başka bir rol kayıtlı.", ErrorType.Conflict);

    public static readonly Error InvalidAccessLevel =
        new("AppRole.InvalidAccessLevel", "Geçersiz erişim seviyesi.", ErrorType.Validation);
}
