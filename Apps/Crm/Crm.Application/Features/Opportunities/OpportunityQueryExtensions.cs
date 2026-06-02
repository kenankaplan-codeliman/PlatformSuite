using Crm.Domain.Entities.Opportunities;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Features.Opportunities;

/// <summary>
/// Opportunity detail projection için ortak Include seti. Read (GetOpportunityHandler) ve
/// Save sonrası reload (Create/UpdateOpportunityHandler.BuildDetailAsync) aynı nav set'i
/// kullansın diye tek yerde tanımlı — satır kalemleri + ürün adı flatten için Products.Product gerekir.
/// </summary>
public static class OpportunityQueryExtensions
{
    public static IQueryable<Opportunity> WithDetailIncludes(this IQueryable<Opportunity> query) =>
        query
            .Include(o => o.Account)
            .Include(o => o.PrimaryContact)
            .Include(o => o.Products).ThenInclude(p => p.Product);
}
