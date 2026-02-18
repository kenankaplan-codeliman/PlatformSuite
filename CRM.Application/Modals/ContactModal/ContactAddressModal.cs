using Crm.Domain.Enums;

namespace CRM.Application.Modals.ContactModal;

public class ContactAddressModal
{
    public string? Id { get; set; }
    public string AddressLine1 { get; set; } = default!;
    public string? AddressLine2 { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? PostalCode { get; set; }
    public string? Country { get; set; }
    public AddressType Type { get; set; }
    public bool IsPrimary { get; set; }
}
