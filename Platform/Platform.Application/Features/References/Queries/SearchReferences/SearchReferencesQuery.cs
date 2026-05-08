using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using Platform.Application.Modals.Common;
using MediatR;

namespace Platform.Application.Features.References.Queries.SearchReferences;

/// <summary>
/// Polimorfik EntityReference arama query'si. <see cref="EntityType"/> string anahtar
/// olarak <see cref="IReferenceRepository.LookupReference"/>'a delege edilir; registry
/// uygun resolver'a yönlendirir. Activity regarding/party gibi UI lookup'larda EntityLookupField
/// birden fazla entity türünü tek endpoint üzerinden tarayabilsin diye ayrı ayrı arama
/// endpoint'lerine gerek kalmadan kullanılır.
/// </summary>
public sealed class SearchReferencesQuery : IQuery<PagedResult<EntityReference>>
{
    public string EntityType { get; init; } = string.Empty;
    public string? SearchText { get; init; }
    public PaginationRequest Pagination { get; init; } = new();
}

public sealed class SearchReferencesHandler
    : IRequestHandler<SearchReferencesQuery, Result<PagedResult<EntityReference>>>
{
    private readonly IReferenceRepository _references;

    public SearchReferencesHandler(IReferenceRepository references) => _references = references;

    public Task<Result<PagedResult<EntityReference>>> Handle(
        SearchReferencesQuery request, CancellationToken cancellationToken)
    {
        var inner = _references.LookupReference(
            request.EntityType,
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
