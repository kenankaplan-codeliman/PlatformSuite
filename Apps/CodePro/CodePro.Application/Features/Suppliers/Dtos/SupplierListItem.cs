namespace CodePro.Application.Features.Suppliers.Dtos;

public class SupplierListItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string? Industry { get; set; }
    public string SupplierType { get; set; } = default!;
    public string SupplierStatus { get; set; } = default!;
    public string CompanyType { get; set; } = default!;
    public string? Vkn { get; set; }
    public string? ContactPersonEmail { get; set; }
    public string? ContactPersonPhone { get; set; }
    public string? City { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
