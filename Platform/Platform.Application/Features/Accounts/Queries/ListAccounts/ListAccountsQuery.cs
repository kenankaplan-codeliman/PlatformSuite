using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;
using Platform.Application.Features.Accounts.Dtos;

namespace Platform.Application.Features.Accounts.Queries.ListAccounts;

public sealed class ListAccountsQuery : IQuery<PagedResult<AccountListItem>>
{
    public PaginationRequest Pagination { get; init; } = new();
    public AccountListFilter Filters { get; init; } = new();
}
