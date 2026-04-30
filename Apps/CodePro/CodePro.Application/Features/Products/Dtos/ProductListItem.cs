namespace CodePro.Application.Features.Products.Dtos;

public class ProductListItem
{
    public Guid Id { get; set; }
    public string Code { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string? ShortDescription { get; set; }
    public Guid ProductCategoryId { get; set; }
    public string? ProductCategoryName { get; set; }
    public string? UnitOfMeasure { get; set; }
    public DateTime ValidFrom { get; set; }
    public DateTime ValidUntil { get; set; }
    public bool IsActive { get; set; }
}
