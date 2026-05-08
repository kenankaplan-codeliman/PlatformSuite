using Platform.Application.Common.Dtos.Communications;
using Crm.Domain.Enums;

namespace Crm.Application.Features.Contacts.Dtos;

public class ContactDetailItem
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    public ContactStatus ContactStatus { get; set; }
    public string? Title { get; set; }
    public string? Department { get; set; }
    public DateTime? BirthDate { get; set; }
    public string? Description { get; set; }
    public List<ContactAccountModal> AccountContacts { get; set; } = new();
    public List<EmailModal> Emails { get; set; } = new();
    public List<PhoneModal> Phones { get; set; } = new();
    public List<AddressModal> Addresses { get; set; } = new();
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsActive { get; set; }
}
