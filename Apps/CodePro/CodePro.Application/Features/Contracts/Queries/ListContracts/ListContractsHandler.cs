using CodePro.Application.Features.Contracts.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Contracts.Queries.ListContracts;

public sealed class ListContractsHandler : IRequestHandler<ListContractsQuery, Result<PagedResult<ContractListItem>>>
{
    private readonly ICodeProDbContext _db;

    public ListContractsHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<PagedResult<ContractListItem>>> Handle(ListContractsQuery request, CancellationToken cancellationToken)
    {
        var query = _db.Contract.AsNoTracking();
        var filters = request.Filters;

        if (!string.IsNullOrWhiteSpace(filters.Search))
        {
            var pattern = filters.Search.ToLower();
            query = query.Where(c =>
                c.Subject.ToLower().Contains(pattern)
                || c.ContractNumber.ToLower().Contains(pattern)
                || c.CounterpartyName.ToLower().Contains(pattern));
        }

        if (filters.Type.HasValue)
            query = query.Where(c => c.Type == filters.Type.Value);

        if (filters.Status.HasValue)
            query = query.Where(c => c.Status == filters.Status.Value);

        if (filters.IsActive.HasValue)
            query = query.Where(c => c.IsActive == filters.IsActive.Value);

        var pageNumber = request.Pagination.PageNumber;
        var pageSize = request.Pagination.PageSize;
        var pageIndex = Math.Max(pageNumber - 1, 0);
        var skip = pageIndex * pageSize;

        var items = await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip(skip)
            .Take(pageSize + 1)
            .ProjectToType<ContractListItem>()
            .ToListAsync(cancellationToken);

        var hasMore = items.Count > pageSize;
        if (hasMore) items.RemoveAt(items.Count - 1);

        return new PagedResult<ContractListItem>
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
