using Crm.Domain.Enums;

namespace CRM.Application.Modals.ContactModal;

public class ContactPhoneModal
{
    public Guid Id { get; set; }
    public string PhoneNumber { get; set; } = default!;
    public PhoneType Type { get; set; }
    public bool IsPrimary { get; set; }
}
