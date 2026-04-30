using CodePro.Domain.Enums;
using Platform.Domain.Entities.Accounts;

namespace CodePro.Domain.Entities.Accounts;

/// <summary>
/// CodePro'ya özgü Account uzantısı: Tedarikçi profili. TPH inheritance —
/// Platform Account'ın <c>account_type = Vendor</c> ayrımıyla aynı tabloda
/// (account) yaşar; supplier_type, supplier_status, company_type, vkn vb. ek
/// kolonlar yalnızca Vendor satırlarında dolu olur. Diğer Account alt türleri
/// (Customer, Prospect, Partner, Competitor, Other) bu kolonları NULL bırakır.
/// </summary>
public class Supplier : Account
{
    public SupplierType SupplierType { get; set; }
    public SupplierStatus SupplierStatus { get; set; } = SupplierStatus.Pending;

    public CompanyType CompanyType { get; set; }
    public CompanyLegalType? CompanyLegalType { get; set; }
    public string? TaxOffice { get; set; }
    public string? Vkn { get; set; }
    public string? MersisNo { get; set; }
}
