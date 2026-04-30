using CodePro.Application.Features.Brands.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;

namespace CodePro.Application.Features.Brands.Queries.ListBrands;

public sealed class ListBrandsQuery : IQuery<PagedResult<BrandListItem>>
{
    public PaginationRequest Pagination { get; init; } = new();
    public BrandListFilter Filters { get; init; } = new();
}
