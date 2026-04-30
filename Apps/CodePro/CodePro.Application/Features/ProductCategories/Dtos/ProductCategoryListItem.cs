namespace CodePro.Application.Features.ProductCategories.Dtos;

public class ProductCategoryListItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string Title { get; set; } = default!;
    public string? Code { get; set; }
    public Guid? ParentCategoryId { get; set; }
    public string? ParentCategoryName { get; set; }
    public bool IsActive { get; set; }
}
