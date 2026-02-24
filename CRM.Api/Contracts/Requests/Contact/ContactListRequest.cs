using CRM.Application.Modals.ContactModal;

namespace CRM.Api.Contracts.Requests.Contact;

public class ContactListRequest
{
    public int Page { get; set; }
    public int PageSize { get; set; }
    public ContactListFilters Filters { get; set; } = new();
}
