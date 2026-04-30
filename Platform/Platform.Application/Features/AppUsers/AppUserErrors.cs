using Platform.Application.Common.Results;

namespace Platform.Application.Features.AppUsers;

public static class AppUserErrors
{
    public static readonly Error NotFound =
        new("AppUser.NotFound", "Kullanıcı bulunamadı.", ErrorType.NotFound);

    public static readonly Error DuplicateEmail =
        new("AppUser.DuplicateEmail", "Bu e-posta adresi başka bir kullanıcıya kayıtlı.", ErrorType.Conflict);

    public static readonly Error OrganizationNotFound =
        new("AppUser.OrganizationNotFound", "Organizasyon bulunamadı.", ErrorType.Validation);

    public static readonly Error ManagerNotFound =
        new("AppUser.ManagerNotFound", "Yönetici kullanıcı bulunamadı.", ErrorType.Validation);

    public static readonly Error CircularManager =
        new("AppUser.CircularManager", "Kullanıcı kendisini yönetici olarak alamaz.", ErrorType.Validation);

    public static readonly Error CurrentPasswordInvalid =
        new("AppUser.CurrentPasswordInvalid", "Mevcut şifre hatalı.", ErrorType.Validation);
}
