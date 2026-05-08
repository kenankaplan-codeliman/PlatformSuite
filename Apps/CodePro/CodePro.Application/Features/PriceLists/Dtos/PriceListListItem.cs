namespace CodePro.Application.Features.PriceLists.Dtos;

public class PriceListListItem
{
    public Guid Id { get; set; }
    public string Code { get; set; } = default!;
    public string Name { get; set; } = default!;
    public Guid SupplierId { get; set; }
    public string? SupplierName { get; set; }
    public bool IsActive { get; set; }
}
