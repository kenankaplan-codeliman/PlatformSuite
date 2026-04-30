namespace CodePro.Application.Features.ProductCategories.Dtos;

public class ProductCategoryListFilter
{
    public string? Search { get; set; }
    public Guid? ParentCategoryId { get; set; }
    public bool? IsActive { get; set; }
}
