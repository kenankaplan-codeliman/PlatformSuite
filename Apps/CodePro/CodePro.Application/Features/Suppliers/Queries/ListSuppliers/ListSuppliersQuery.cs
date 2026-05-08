using CodePro.Application.Features.Suppliers.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;

namespace CodePro.Application.Features.Suppliers.Queries.ListSuppliers;

public sealed class ListSuppliersQuery : IQuery<PagedResult<SupplierListItem>>
{
    public PaginationRequest Pagination { get; init; } = new();
    public SupplierListFilter Filters { get; init; } = new();
}
