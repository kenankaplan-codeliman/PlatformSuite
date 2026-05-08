using CodePro.Application.Features.Suppliers.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Suppliers.Queries.ListSuppliers;

public sealed class ListSuppliersHandler : IRequestHandler<ListSuppliersQuery, Result<PagedResult<SupplierListItem>>>
{
    private readonly ICodeProDbContext _db;

    public ListSuppliersHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<PagedResult<SupplierListItem>>> Handle(ListSuppliersQuery request, CancellationToken cancellationToken)
    {
        var query = _db.Supplier.AsNoTracking();
        var filters = request.Filters;

        if (!string.IsNullOrWhiteSpace(filters.Search))
        {
            var pattern = filters.Search.ToLower();
            query = query.Where(s =>
                s.Name.ToLower().Contains(pattern)
                || (s.Vkn != null && s.Vkn.ToLower().Contains(pattern))
                || (s.ContactPersonEmail != null && s.ContactPersonEmail.ToLower().Contains(pattern))
                || (s.City != null && s.City.ToLower().Contains(pattern)));
        }

        if (filters.SupplierType.HasValue)
            query = query.Where(s => s.SupplierType == filters.SupplierType.Value);

        if (filters.SupplierStatus.HasValue)
            query = query.Where(s => s.SupplierStatus == filters.SupplierStatus.Value);

        if (filters.CompanyType.HasValue)
            query = query.Where(s => s.CompanyType == filters.CompanyType.Value);

        if (filters.IsActive.HasValue)
            query = query.Where(s => s.IsActive == filters.IsActive.Value);

        var pageNumber = request.Pagination.PageNumber;
        var pageSize = request.Pagination.PageSize;
        var pageIndex = Math.Max(pageNumber - 1, 0);
        var skip = pageIndex * pageSize;

        var items = await query
            .OrderByDescending(s => s.CreatedAt)
            .Skip(skip)
            .Take(pageSize + 1)
            .ProjectToType<SupplierListItem>()
            .ToListAsync(cancellationToken);

        var hasMore = items.Count > pageSize;
        if (hasMore) items.RemoveAt(items.Count - 1);

        return new PagedResult<SupplierListItem>
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
