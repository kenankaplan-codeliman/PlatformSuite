namespace Crm.Domain.Parameters;

/// <summary>
/// Adres ülke/şehir/ilçe alanlarının GeneralParameter kodları. Hiyerarşi parent_code
/// zinciriyle kurulur ve bağımlıdır:
///   <see cref="Country"/> (kök)  →  ülke değerleri (parent_code = "Country", code = ISO cca2)
///                                →  şehir değerleri (parent_code = &lt;ülke kodu&gt;)
///                                →  ilçe değerleri  (parent_code = &lt;şehir kodu&gt;)
/// Şehir ve ilçe için sabit kök yoktur; parent_code, seçilen üst kaydın code'udur.
/// </summary>
public static class AddressParameterCodes
{
    public const string Country = "Country";
}
