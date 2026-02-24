using Crm.Domain.Enums;

namespace CRM.Application.Modals.ContactModal;

public class ContactEmailModal
{
    public Guid Id { get; set; }
    public string Email { get; set; } = default!;
    public EmailType Type { get; set; }
    public bool IsPrimary { get; set; }
}
