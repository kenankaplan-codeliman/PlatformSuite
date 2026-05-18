namespace CodePro.Application.Features.Suppliers.Dtos;

public class SupplierListFilter
{
    public string? Search { get; set; }
    public string? SupplierType { get; set; }
    public string? SupplierStatus { get; set; }
    public string? CompanyType { get; set; }
    public bool? IsActive { get; set; }
}
