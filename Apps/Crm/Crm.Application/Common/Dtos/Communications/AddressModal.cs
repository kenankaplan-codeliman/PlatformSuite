using Crm.Domain.Enums;

namespace Crm.Application.Common.Dtos.Communications;

public class AddressModal
{
    public Guid? Id { get; set; }
    public string AddressLine1 { get; set; } = default!;
    public string? AddressLine2 { get; set; }

    // GeneralParameter kodları + denormalize adlar (code boşsa elle yazılmış demektir)
    public string? CountryCode { get; set; }
    public string? CountryName { get; set; }
    public string? CityCode { get; set; }
    public string? CityName { get; set; }
    public string? DistrictCode { get; set; }
    public string? DistrictName { get; set; }

    public string? State { get; set; }
    public string? PostalCode { get; set; }
    public AddressType Type { get; set; }
    public bool IsPrimary { get; set; }
}
