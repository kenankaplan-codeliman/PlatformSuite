using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Dtos.Communications;
using Platform.Application.Features.Accounts.Dtos;
using Platform.Domain.Enums;

namespace Platform.Application.Features.Accounts.Commands.CreateAccount;

public sealed class CreateAccountCommand : ICommand<AccountDetailItem>
{
    public string AccountName { get; init; } = string.Empty;
    public AccountType AccountType { get; init; }
    public AccountStatus AccountStatus { get; init; } = AccountStatus.Prospect;
    public string? Industry { get; init; }
    public decimal? AnnualRevenue { get; init; }
    public int? NumberOfEmployees { get; init; }
    public string? Website { get; init; }
    public string? Description { get; init; }
    public Guid? ParentAccountId { get; init; }
    public List<EmailModal> Emails { get; init; } = new();
    public List<PhoneModal> Phones { get; init; } = new();
    public List<AddressModal> Addresses { get; init; } = new();
    public List<AccountContactModal> Contacts { get; init; } = new();
}
