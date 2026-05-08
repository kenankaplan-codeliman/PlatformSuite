using Platform.Application.Common.Results;

namespace Platform.Application.Features.AppUsers;

public static class AppUserErrors
{
    public static readonly Error NotFound =
        new("User.NotFound", "Kullanıcı bulunamadı.", ErrorType.NotFound);

    public static readonly Error DuplicateEmail =
        new("User.DuplicateEmail", "Bu e-posta adresi başka bir kullanıcıya kayıtlı.", ErrorType.Conflict);

    public static readonly Error OrganizationNotFound =
        new("User.OrganizationNotFound", "Organizasyon bulunamadı.", ErrorType.Validation);

    public static readonly Error ManagerNotFound =
        new("User.ManagerNotFound", "Yönetici kullanıcı bulunamadı.", ErrorType.Validation);

    public static readonly Error CircularManager =
        new("User.CircularManager", "Kullanıcı kendisini yönetici olarak alamaz.", ErrorType.Validation);

    public static readonly Error CurrentPasswordInvalid =
        new("User.CurrentPasswordInvalid", "Mevcut şifre hatalı.", ErrorType.Validation);
}
