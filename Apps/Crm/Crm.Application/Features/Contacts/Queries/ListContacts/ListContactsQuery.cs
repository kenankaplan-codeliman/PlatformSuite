using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;
using Crm.Application.Features.Contacts.Dtos;

namespace Crm.Application.Features.Contacts.Queries.ListContacts;

public sealed class ListContactsQuery : IQuery<PagedResult<ContactListItem>>
{
    public PaginationRequest Pagination { get; init; } = new();
    public ContactListFilters Filters { get; init; } = new();
}
