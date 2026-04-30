using CodePro.Application.Features.Contracts.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;

namespace CodePro.Application.Features.Contracts.Queries.ListContracts;

public sealed class ListContractsQuery : IQuery<PagedResult<ContractListItem>>
{
    public PaginationRequest Pagination { get; init; } = new();
    public ContractListFilter Filters { get; init; } = new();
}
