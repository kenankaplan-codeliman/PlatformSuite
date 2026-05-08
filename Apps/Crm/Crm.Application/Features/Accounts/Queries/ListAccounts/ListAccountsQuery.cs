using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;
using Crm.Application.Features.Accounts.Dtos;

namespace Crm.Application.Features.Accounts.Queries.ListAccounts;

public sealed class ListAccountsQuery : IQuery<PagedResult<AccountListItem>>
{
    public PaginationRequest Pagination { get; init; } = new();
    public AccountListFilter Filters { get; init; } = new();
}
