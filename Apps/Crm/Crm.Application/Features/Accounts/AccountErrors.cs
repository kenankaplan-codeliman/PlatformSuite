using Platform.Application.Common.Results;

namespace Crm.Application.Features.Accounts;

public static class AccountErrors
{
    public static readonly Error NotFound =
        new("Account.NotFound", "Firma bulunamadı.", ErrorType.NotFound);

    public static readonly Error InvalidStatus =
        new("Account.InvalidStatus", "Geçersiz firma durumu.", ErrorType.Validation);

    public static readonly Error InvalidType =
        new("Account.InvalidType", "Geçersiz firma tipi.", ErrorType.Validation);

    public static readonly Error InvalidCurrency =
        new("Account.InvalidCurrency", "Geçersiz para birimi.", ErrorType.Validation);
}
