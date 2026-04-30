using CodePro.Application.Features.Manufacturers.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;

namespace CodePro.Application.Features.Manufacturers.Queries.ListManufacturers;

public sealed class ListManufacturersQuery : IQuery<PagedResult<ManufacturerListItem>>
{
    public PaginationRequest Pagination { get; init; } = new();
    public ManufacturerListFilter Filters { get; init; } = new();
}
