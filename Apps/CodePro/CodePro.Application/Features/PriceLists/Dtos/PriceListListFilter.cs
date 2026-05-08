namespace CodePro.Application.Features.PriceLists.Dtos;

public class PriceListListFilter
{
    public string? Search { get; set; }
    public Guid? SupplierId { get; set; }
    public bool? IsActive { get; set; }
}
