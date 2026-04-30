using CodePro.Application.Features.EDocuments.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.EDocuments.Queries.ListEDocuments;

public sealed class ListEDocumentsHandler : IRequestHandler<ListEDocumentsQuery, Result<PagedResult<EDocumentListItem>>>
{
    private readonly ICodeProDbContext _db;

    public ListEDocumentsHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<PagedResult<EDocumentListItem>>> Handle(ListEDocumentsQuery request, CancellationToken cancellationToken)
    {
        var query = _db.EDocument.AsNoTracking();
        var filters = request.Filters;

        if (!string.IsNullOrWhiteSpace(filters.Search))
        {
            var pattern = filters.Search.ToLower();
            query = query.Where(e => e.Subject.ToLower().Contains(pattern));
        }

        if (filters.DocumentType.HasValue)
            query = query.Where(e => e.DocumentType == filters.DocumentType.Value);

        if (filters.Status.HasValue)
            query = query.Where(e => e.Status == filters.Status.Value);

        if (!string.IsNullOrWhiteSpace(filters.EntityType))
            query = query.Where(e => e.EntityType == filters.EntityType);

        if (filters.EntityId.HasValue)
            query = query.Where(e => e.EntityId == filters.EntityId.Value);

        if (filters.IsActive.HasValue)
            query = query.Where(e => e.IsActive == filters.IsActive.Value);

        var pageNumber = request.Pagination.PageNumber;
        var pageSize = request.Pagination.PageSize;
        var pageIndex = Math.Max(pageNumber - 1, 0);
        var skip = pageIndex * pageSize;

        var items = await query
            .OrderByDescending(e => e.CreatedAt)
            .Skip(skip)
            .Take(pageSize + 1)
            .ProjectToType<EDocumentListItem>()
            .ToListAsync(cancellationToken);

        var hasMore = items.Count > pageSize;
        if (hasMore) items.RemoveAt(items.Count - 1);

        return new PagedResult<EDocumentListItem>
        {
            Data = items,
            Pagination = new PaginationResponse
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                HasMoreRecord = hasMore,
            },
        };
    }
}
