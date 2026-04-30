using Platform.Domain.Enums;

namespace Platform.Application.Common.Dtos.Communications;

public class AddressModal
{
    public Guid? Id { get; set; }
    public string AddressLine1 { get; set; } = default!;
    public string? AddressLine2 { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? PostalCode { get; set; }
    public string? Country { get; set; }
    public AddressType Type { get; set; }
    public bool IsPrimary { get; set; }
}
