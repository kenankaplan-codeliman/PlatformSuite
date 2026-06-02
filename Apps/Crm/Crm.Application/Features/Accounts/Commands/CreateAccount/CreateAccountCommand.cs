using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Attachments;
using Crm.Application.Common.Dtos.Communications;
using Crm.Application.Features.Accounts.Dtos;
using Platform.Application.Modals.Common;

namespace Crm.Application.Features.Accounts.Commands.CreateAccount;

public sealed class CreateAccountCommand : ICommand<AccountDetailItem>, IAttachmentCarrier
{
    public string AccountName { get; init; } = string.Empty;
    public string AccountType { get; init; } = "Customer";
    public string AccountStatus { get; init; } = "Prospect";
    public string? Industry { get; init; }
    public decimal? AnnualRevenue { get; init; }
    public string? AnnualRevenueCurrency { get; init; }
    public int? NumberOfEmployees { get; init; }
    public string? Website { get; init; }
    public string? Description { get; init; }
    public EntityReference? ParentAccount { get; init; }
    public List<EmailModal> Emails { get; init; } = new();
    public List<PhoneModal> Phones { get; init; } = new();
    public List<AddressModal> Addresses { get; init; } = new();
    public List<AccountContactModal> Contacts { get; init; } = new();
    public List<AttachmentAssociation> Attachments { get; init; } = new();
}
