using CodePro.Domain.Enums;

namespace CodePro.Application.Features.Suppliers.Dtos;

public class SupplierListItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string? Industry { get; set; }
    public SupplierType SupplierType { get; set; }
    public SupplierStatus SupplierStatus { get; set; }
    public CompanyType CompanyType { get; set; }
    public string? Vkn { get; set; }
    public string? ContactPersonEmail { get; set; }
    public string? ContactPersonPhone { get; set; }
    public string? City { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
