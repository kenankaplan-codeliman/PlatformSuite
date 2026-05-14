namespace Crm.Application.Features.Accounts.Dtos;

public class AccountListItem
{
    public Guid Id { get; set; }
    public string AccountName { get; set; } = default!;
    public string AccountType { get; set; } = default!;
    public string AccountStatus { get; set; } = default!;
    public string? Industry { get; set; }
    public decimal? AnnualRevenue { get; set; }
    public int? NumberOfEmployees { get; set; }
    public string? Website { get; set; }
    public string? PrimaryEmail { get; set; }
    public string? PrimaryPhone { get; set; }
    public string? PrimaryCity { get; set; }
    public bool IsActive { get; set; }
}
