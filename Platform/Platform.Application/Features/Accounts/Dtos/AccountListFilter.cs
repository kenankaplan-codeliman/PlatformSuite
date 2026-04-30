using Platform.Domain.Enums;

namespace Platform.Application.Features.Accounts.Dtos;

public class AccountListFilter
{
    public string? accountName { get; set; }
    public AccountType? accountType { get; set; }
    public AccountStatus? accountStatus { get; set; }
    public string? Industry { get; set; }
    public bool? isActive { get; set; }
}
