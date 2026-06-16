using Crm.Application.Features.Dashboard.Dtos;
using Crm.Application.Interfaces;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Features.Dashboard.Queries.ListLeadsToAttention;

public sealed class ListLeadsToAttentionHandler
    : IRequestHandler<ListLeadsToAttentionQuery, Result<PagedResult<LeadDigestItem>>>
{
    private readonly ICrmDbContext _db;
    private readonly IContextUser _contextUser;

    public ListLeadsToAttentionHandler(ICrmDbContext db, IContextUser contextUser)
    {
        _db = db;
        _contextUser = contextUser;
    }

    public async Task<Result<PagedResult<LeadDigestItem>>> Handle(ListLeadsToAttentionQuery request, CancellationToken cancellationToken)
    {
        var pageNumber = request.Pagination.PageNumber;
        var pageSize = request.Pagination.PageSize;
        var skip = Math.Max(pageNumber - 1, 0) * pageSize;

        // Dönüştürülmemiş + aktif lead'ler; en yüksek skor önce, sonra en yeni.
        var query = _db.Lead.AsNoTracking()
            .Where(l => l.IsActive && l.ConvertedAt == null);

        if (request.OwnerOnly)
            query = query.Where(l => l.OwnerId == _contextUser.UserId);

        var items = await query
            .OrderByDescending(l => l.Score ?? 0)
            .ThenByDescending(l => l.CreatedAt)
            .Skip(skip)
            .Take(pageSize + 1)
            .ProjectToType<LeadDigestItem>()
            .ToListAsync(cancellationToken);

        var hasMore = items.Count > pageSize;
        if (hasMore) items.RemoveAt(items.Count - 1);

        return new PagedResult<LeadDigestItem>
        {
            Data = items,
            Pagination = new PaginationResponse { PageNumber = pageNumber, PageSize = pageSize, HasMoreRecord = hasMore },
        };
    }
}
