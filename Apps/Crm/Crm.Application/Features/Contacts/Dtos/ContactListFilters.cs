using Crm.Domain.Enums;

namespace Crm.Application.Features.Contacts.Dtos;

public class ContactListFilters
{
    public string? ContactName { get; set; }
    public Guid? AccountId { get; set; }
    public ContactStatus? ContactStatus { get; set; }
    public string? Title { get; set; }
    public string? Department { get; set; }
    public bool? IsActive { get; set; }
}
