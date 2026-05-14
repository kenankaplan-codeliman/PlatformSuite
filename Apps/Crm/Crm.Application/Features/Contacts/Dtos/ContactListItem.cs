namespace Crm.Application.Features.Contacts.Dtos;

public class ContactListItem
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    public string FullName { get; set; } = default!;
    public string ContactStatus { get; set; } = default!;
    public string? Title { get; set; }
    public string? Department { get; set; }
    public ContactAccountModal? PrimaryAccount { get; set; }
    public string? PrimaryEmail { get; set; }
    public string? PrimaryPhone { get; set; }
    public bool IsActive { get; set; }
}
