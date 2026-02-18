

namespace CRM.Application.Modals.ContactModal;

public class ContactListItem
{
    public Guid Id { get; set; } = default!;
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    public string FullName { get; set; } = default!;
    public string? Title { get; set; }
    public string? Department { get; set; }
    public ContactAccountModal? PrimaryAccount { get; set; }
    public string? PrimaryEmail { get; set; }
    public string? PrimaryPhone { get; set; }
    public bool IsActive { get; set; }
}
