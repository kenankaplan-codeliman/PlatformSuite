namespace Crm.Domain.Parameters;

/// <summary>
/// Contact entity'sinin GeneralParameter'a taşınan alanlarının parentCode'ları.
/// general_parameter tablosundaki kök satırın <c>code</c> değeri ile birebir.
/// Eski <c>ContactStatus</c> enumunun yerini alır.
/// </summary>
public static class ContactParameterCodes
{
    public const string Status = "ContactStatus";
}
