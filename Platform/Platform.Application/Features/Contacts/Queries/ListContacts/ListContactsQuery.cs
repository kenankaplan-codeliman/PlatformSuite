using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;
using Platform.Application.Features.Contacts.Dtos;

namespace Platform.Application.Features.Contacts.Queries.ListContacts;

public sealed class ListContactsQuery : IQuery<PagedResult<ContactListItem>>
{
    public PaginationRequest Pagination { get; init; } = new();
    public ContactListFilters Filters { get; init; } = new();
}
