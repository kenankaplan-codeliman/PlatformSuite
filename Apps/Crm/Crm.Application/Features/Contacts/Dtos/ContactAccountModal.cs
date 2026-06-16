using Platform.Application.Modals.Common;

namespace Crm.Application.Features.Contacts.Dtos;

public class ContactAccountModal
{
    public Guid Id { get; set; }
    public EntityReference? Account { get; set; }
    public string? Role { get; set; }
    public bool IsPrimary { get; set; }
}
