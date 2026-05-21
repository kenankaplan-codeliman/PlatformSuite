using Crm.Domain.Enums;

namespace Crm.Application.Common.Dtos.Communications;

public class PhoneModal
{
    public Guid Id { get; set; }
    public string PhoneNumber { get; set; } = default!;
    public PhoneType Type { get; set; }
    public bool IsPrimary { get; set; }
}
