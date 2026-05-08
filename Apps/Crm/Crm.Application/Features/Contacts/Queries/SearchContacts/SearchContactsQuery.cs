using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;
using Platform.Application.Modals.Common;

namespace Crm.Application.Features.Contacts.Queries.SearchContacts;

public sealed class SearchContactsQuery : IQuery<PagedResult<EntityReference>>
{
    public string? SearchText { get; init; }
    public PaginationRequest Pagination { get; init; } = new();
}
