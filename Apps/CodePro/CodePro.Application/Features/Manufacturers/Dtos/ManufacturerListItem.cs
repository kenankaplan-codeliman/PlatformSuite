namespace CodePro.Application.Features.Manufacturers.Dtos;

public class ManufacturerListItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
