namespace CodePro.Application.Features.ProductPrices.Dtos;

public class ProductPriceListFilter
{
    public Guid? ProductId { get; set; }
    public Guid? SupplierId { get; set; }
    public Guid? PriceListId { get; set; }
    public bool? IsActive { get; set; }
}
