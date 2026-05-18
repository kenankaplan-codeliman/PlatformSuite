namespace CodePro.Application.Features.Suppliers.Dtos;

public class SupplierDetailItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string? Industry { get; set; }
    public string? Website { get; set; }
    public string? Description { get; set; }
    public decimal? AnnualRevenue { get; set; }
    public int? NumberOfEmployees { get; set; }

    public string SupplierType { get; set; } = default!;
    public string SupplierStatus { get; set; } = default!;
    public string CompanyType { get; set; } = default!;
    public string? CompanyLegalType { get; set; }
    public string? TaxOffice { get; set; }
    public string? Vkn { get; set; }
    public string? MersisNo { get; set; }

    public string? ContactPersonName { get; set; }
    public string? ContactPersonEmail { get; set; }
    public string? ContactPersonPhone { get; set; }

    public string? AddressLine { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public string? PostalCode { get; set; }

    public bool IsActive { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
