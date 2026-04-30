using CodePro.Application.Features.EDocuments.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;

namespace CodePro.Application.Features.EDocuments.Queries.ListEDocuments;

public sealed class ListEDocumentsQuery : IQuery<PagedResult<EDocumentListItem>>
{
    public PaginationRequest Pagination { get; init; } = new();
    public EDocumentListFilter Filters { get; init; } = new();
}
