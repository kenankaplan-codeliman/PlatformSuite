using Crm.Domain.Enums;

namespace Crm.Application.Common.Dtos.Communications;

public class EmailModal
{
    public Guid Id { get; set; }
    public string Email { get; set; } = default!;
    public EmailType Type { get; set; }
    public bool IsPrimary { get; set; }
}
