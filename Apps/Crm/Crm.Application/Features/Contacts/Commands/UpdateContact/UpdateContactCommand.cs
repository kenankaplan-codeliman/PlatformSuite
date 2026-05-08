using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Dtos.Communications;
using Crm.Application.Features.Contacts.Dtos;
using Crm.Domain.Enums;

namespace Crm.Application.Features.Contacts.Commands.UpdateContact;

public sealed class UpdateContactCommand : ICommand<ContactDetailItem>
{
    public Guid Id { get; init; }
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public ContactStatus ContactStatus { get; init; }
    public string? Title { get; init; }
    public string? Department { get; init; }
    public DateTime? BirthDate { get; init; }
    public string? Description { get; init; }
    public List<ContactAccountModal> AccountContacts { get; init; } = new();
    public List<EmailModal> Emails { get; init; } = new();
    public List<PhoneModal> Phones { get; init; } = new();
    public List<AddressModal> Addresses { get; init; } = new();
}
