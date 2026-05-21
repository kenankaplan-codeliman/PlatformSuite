using Crm.Application.Common.Dtos.Communications;
using Platform.Application.Modals.Common;

namespace Crm.Application.Features.Accounts.Dtos;

public class AccountDetailItem
{
    public Guid Id { get; set; }
    public string AccountName { get; set; } = default!;
    public string AccountType { get; set; } = default!;
    public string AccountStatus { get; set; } = default!;
    public string? Industry { get; set; }
    public decimal? AnnualRevenue { get; set; }
    public int? NumberOfEmployees { get; set; }
    public string? Website { get; set; }
    public string? Description { get; set; }
    public EntityReference? ParentAccount { get; set; }
    public List<EmailModal> Emails { get; set; } = new();
    public List<PhoneModal> Phones { get; set; } = new();
    public List<AddressModal> Addresses { get; set; } = new();
    public List<AccountContactModal> Contacts { get; set; } = new();
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsActive { get; set; }
}
