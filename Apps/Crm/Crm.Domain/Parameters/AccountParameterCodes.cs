namespace Crm.Domain.Parameters;

/// <summary>
/// Account entity'sinin GeneralParameter'a taşınan alanlarının parentCode'ları.
/// general_parameter tablosundaki kök satırın <c>code</c> değeri ile birebir.
/// Eski <c>AccountStatus</c> / <c>AccountType</c> enumlarının yerini alır.
/// </summary>
public static class AccountParameterCodes
{
    public const string Status = "AccountStatus";
    public const string Type = "AccountType";
}
