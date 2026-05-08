using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using Crm.Application.Interfaces;
using Platform.Application.Modals.Common;
using Crm.Domain.Entities.Accounts;
using MediatR;

namespace Crm.Application.Features.Accounts.Queries.SearchAccounts;

public sealed class SearchAccountsHandler : IRequestHandler<SearchAccountsQuery, Result<PagedResult<EntityReference>>>
{
    private readonly IReferenceRepository _references;

    public SearchAccountsHandler(IReferenceRepository references) => _references = references;

    public Task<Result<PagedResult<EntityReference>>> Handle(SearchAccountsQuery request, CancellationToken cancellationToken)
    {
        var inner = _references.LookupReference(
            nameof(Account),
            request.SearchText ?? string.Empty,
            new PaginationInfo(request.Pagination.PageNumber, request.Pagination.PageSize));

        var paged = new PagedResult<EntityReference>
        {
            Data = inner.Data,
            Pagination = new PaginationResponse
            {
                PageNumber = inner.Page,
                PageSize = inner.PageSize,
                HasMoreRecord = inner.HasMore,
            },
        };

        return Task.FromResult<Result<PagedResult<EntityReference>>>(paged);
    }
}
