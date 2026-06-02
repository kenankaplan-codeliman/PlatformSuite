namespace Crm.Application.Features.Products.Dtos;

public class ProductListFilter
{
    public string? name { get; set; }
    public string? productCode { get; set; }
    public string? category { get; set; }
    public bool? isActive { get; set; }
}
