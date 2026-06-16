using Platform.Application.Modals.Common;

namespace Crm.Application.Features.Accounts.Dtos;

public class AccountContactModal
{
    public Guid Id { get; set; }
    public EntityReference? Contact { get; set; }
    public string? Role { get; set; }
    public bool IsPrimary { get; set; }
}
