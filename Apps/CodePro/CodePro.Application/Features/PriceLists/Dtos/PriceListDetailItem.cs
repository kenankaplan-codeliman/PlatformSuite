namespace CodePro.Application.Features.PriceLists.Dtos;

public class PriceListDetailItem
{
    public Guid Id { get; set; }
    public string Code { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public Guid SupplierAccountId { get; set; }
    public string? SupplierAccountName { get; set; }
    public bool IsActive { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
