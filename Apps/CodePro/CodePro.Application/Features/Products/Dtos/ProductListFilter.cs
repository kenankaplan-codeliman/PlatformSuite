namespace CodePro.Application.Features.Products.Dtos;

public class ProductListFilter
{
    public string? Search { get; set; }
    public Guid? ProductCategoryId { get; set; }
    public bool? IsActive { get; set; }
}
