using Platform.Application.Common.Results;

namespace Crm.Application.Features.Accounts;

public static class AccountErrors
{
    public static readonly Error NotFound =
        new("Account.NotFound", "Firma bulunamadı.", ErrorType.NotFound);
}
