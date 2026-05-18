namespace CodePro.Domain.Parameters;

/// <summary>
/// Supplier entity'sinin GeneralParameter'a taşınan alanlarının parentCode'ları.
/// general_parameter tablosundaki kök satırın <c>code</c> değeri ile birebir.
/// Eski <c>SupplierType</c> / <c>SupplierStatus</c> / <c>CompanyType</c> /
/// <c>CompanyLegalType</c> enumlarının yerini alır.
/// </summary>
public static class SupplierParameterCodes
{
    public const string Type = "SupplierType";
    public const string Status = "SupplierStatus";
    public const string CompanyType = "CompanyType";
    public const string CompanyLegalType = "CompanyLegalType";
}
