namespace Crm.Application.Features.Accounts.Dtos;

public class AccountListFilter
{
    public string? accountName { get; set; }
    public string? accountType { get; set; }
    public string? accountStatus { get; set; }
    public string? Industry { get; set; }
    public bool? isActive { get; set; }
}
