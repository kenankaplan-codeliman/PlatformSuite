using CodePro.Domain.Enums;

namespace CodePro.Application.Features.Suppliers.Dtos;

public class SupplierListFilter
{
    public string? Search { get; set; }
    public SupplierType? SupplierType { get; set; }
    public SupplierStatus? SupplierStatus { get; set; }
    public CompanyType? CompanyType { get; set; }
    public bool? IsActive { get; set; }
}
