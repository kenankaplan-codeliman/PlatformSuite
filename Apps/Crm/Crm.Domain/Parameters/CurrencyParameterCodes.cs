namespace Crm.Domain.Parameters;

/// <summary>
/// Para birimi (currency) GeneralParameter kök kodu. general_parameter tablosundaki
/// kök satırın <c>code</c> değeri ile birebir; değer satırları ISO 4217 kodlarıdır
/// (TRY, USD, EUR, ...). Seed Platform InitData'sında (cross-cutting referans veri).
/// </summary>
public static class CurrencyParameterCodes
{
    public const string CurrencyType = "CurrencyType";
}
