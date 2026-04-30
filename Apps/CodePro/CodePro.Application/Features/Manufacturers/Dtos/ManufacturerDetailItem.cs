namespace CodePro.Application.Features.Manufacturers.Dtos;

public class ManufacturerDetailItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public bool IsActive { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
