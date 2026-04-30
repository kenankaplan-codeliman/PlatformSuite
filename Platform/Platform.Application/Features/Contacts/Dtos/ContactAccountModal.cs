namespace Platform.Application.Features.Contacts.Dtos;

public class ContactAccountModal
{
    public Guid Id { get; set; }
    public Guid AccountId { get; set; }
    public string? AccountName { get; set; }
    public string? Role { get; set; }
    public bool IsPrimary { get; set; }
}
