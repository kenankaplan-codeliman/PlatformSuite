using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using Platform.Application.Modals.Common;
using Platform.Domain.Enums;
using MediatR;

namespace Platform.Application.Features.Contacts.Queries.SearchContacts;

public sealed class SearchContactsHandler : IRequestHandler<SearchContactsQuery, Result<PagedResult<EntityReference>>>
{
    private readonly IReferenceRepository _references;

    public SearchContactsHandler(IReferenceRepository references) => _references = references;

    public Task<Result<PagedResult<EntityReference>>> Handle(SearchContactsQuery request, CancellationToken cancellationToken)
    {
        var inner = _references.LookupReference(
            EntityType.Contact,
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
