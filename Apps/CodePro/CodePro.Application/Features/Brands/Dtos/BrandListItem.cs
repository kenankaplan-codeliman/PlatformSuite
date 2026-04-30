namespace CodePro.Application.Features.Brands.Dtos;

public class BrandListItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
