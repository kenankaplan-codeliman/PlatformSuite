using Platform.Application.Common.Abstractions;
using Crm.Application.Common.Dtos.Communications;
using Crm.Application.Features.Contacts.Dtos;

namespace Crm.Application.Features.Contacts.Commands.CreateContact;

public sealed class CreateContactCommand : ICommand<ContactDetailItem>
{
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public string ContactStatus { get; init; } = "Active";
    public string? Title { get; init; }
    public string? Department { get; init; }
    public DateTime? BirthDate { get; init; }
    public string? Description { get; init; }
    public List<ContactAccountModal> AccountContacts { get; init; } = new();
    public List<EmailModal> Emails { get; init; } = new();
    public List<PhoneModal> Phones { get; init; } = new();
    public List<AddressModal> Addresses { get; init; } = new();
}
