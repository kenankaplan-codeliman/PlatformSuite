using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Dtos.Communications;
using Crm.Application.Features.Accounts.Dtos;
using Platform.Application.Modals.Common;
using Crm.Domain.Enums;

namespace Crm.Application.Features.Accounts.Commands.UpdateAccount;

public sealed class UpdateAccountCommand : ICommand<AccountDetailItem>
{
    public Guid Id { get; init; }
    public string AccountName { get; init; } = string.Empty;
    public AccountType AccountType { get; init; }
    public AccountStatus AccountStatus { get; init; }
    public string? Industry { get; init; }
    public decimal? AnnualRevenue { get; init; }
    public int? NumberOfEmployees { get; init; }
    public string? Website { get; init; }
    public string? Description { get; init; }
    public EntityReference? ParentAccount { get; init; }
    public List<EmailModal> Emails { get; init; } = new();
    public List<PhoneModal> Phones { get; init; } = new();
    public List<AddressModal> Addresses { get; init; } = new();
    public List<AccountContactModal> Contacts { get; init; } = new();
}
