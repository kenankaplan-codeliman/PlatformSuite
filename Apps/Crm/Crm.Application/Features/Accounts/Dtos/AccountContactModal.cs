namespace Crm.Application.Features.Accounts.Dtos;

public class AccountContactModal
{
    public Guid Id { get; set; }
    public Guid ContactId { get; set; }
    public string? ContactName { get; set; }
    public string? Role { get; set; }
    public bool IsPrimary { get; set; }
}
