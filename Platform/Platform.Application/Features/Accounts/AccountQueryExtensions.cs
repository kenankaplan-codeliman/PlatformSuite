using Platform.Domain.Entities.Accounts;
using Microsoft.EntityFrameworkCore;

namespace Platform.Application.Features.Accounts;

/// <summary>
/// Account detail projection için ortak Include seti. Read (GetAccountHandler),
/// Save sonrası reload (Create/UpdateAccountHandler.BuildDetailAsync) ve tracker'a
/// yüklenen Update entity'si (AccountRepository.GetAsync) — üç noktada da aynı
/// nav set'i kullanılsın diye tek yerde tanımlı. Yeni bir relation eklendiğinde
/// burayı güncellemek yeterli.
/// </summary>
public static class AccountQueryExtensions
{
    public static IQueryable<Account> WithDetailIncludes(this IQueryable<Account> query) =>
        query
            .Include(a => a.ParentAccount)
            .Include(a => a.Emails)
            .Include(a => a.Phones)
            .Include(a => a.Addresses)
            .Include(a => a.AccountContacts).ThenInclude(ac => ac.Contact);
}
