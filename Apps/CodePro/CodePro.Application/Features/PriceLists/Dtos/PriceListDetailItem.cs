using Platform.Application.Modals.Common;

namespace CodePro.Application.Features.PriceLists.Dtos;

public class PriceListDetailItem
{
    public Guid Id { get; set; }
    public string Code { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public EntityReference? Supplier { get; set; }
    public bool IsActive { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
