namespace CodePro.Application.Features.PriceLists.Dtos;

public class PriceListListItem
{
    public Guid Id { get; set; }
    public string Code { get; set; } = default!;
    public string Name { get; set; } = default!;
    public Guid SupplierAccountId { get; set; }
    public string? SupplierAccountName { get; set; }
    public bool IsActive { get; set; }
}
