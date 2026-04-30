using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using Platform.Application.Modals.Common;
using Platform.Domain.Enums;
using MediatR;

namespace Platform.Application.Features.Users.Queries.SearchUsers;

public sealed class SearchUsersQuery : IQuery<PagedResult<EntityReference>>
{
    public string? SearchText { get; init; }
    public PaginationRequest Pagination { get; init; } = new();
}

public sealed class SearchUsersHandler : IRequestHandler<SearchUsersQuery, Result<PagedResult<EntityReference>>>
{
    private readonly IReferenceRepository _references;

    public SearchUsersHandler(IReferenceRepository references) => _references = references;

    public Task<Result<PagedResult<EntityReference>>> Handle(SearchUsersQuery request, CancellationToken cancellationToken)
    {
        var inner = _references.LookupReference(
            EntityType.User,
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
