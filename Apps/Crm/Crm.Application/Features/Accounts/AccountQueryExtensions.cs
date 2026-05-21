using Crm.Domain.Entities.Accounts;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Features.Accounts;

/// <summary>
/// Account detail projection için ortak Include seti. Read (GetAccountHandler),
/// Save sonrası reload (Create/UpdateAccountHandler.BuildDetailAsync) ve tracker'a
/// yüklenen Update entity'si (AccountRepository.GetAsync) — üç noktada da aynı
/// nav set'i kullanılsın diye tek yerde tanımlı.
/// Email/Phone/Address aggregate navigation değil; polimorfik owner üzerinden
/// ICommunicationRepository / CommunicationQueryExtensions ile yüklenir.
/// </summary>
public static class AccountQueryExtensions
{
    public static IQueryable<Account> WithDetailIncludes(this IQueryable<Account> query) =>
        query
            .Include(a => a.ParentAccount)
            .Include(a => a.AccountContacts).ThenInclude(ac => ac.Contact);
}
