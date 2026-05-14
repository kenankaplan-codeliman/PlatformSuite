namespace Crm.Domain.Parameters;

/// <summary>
/// Lead entity'sinin GeneralParameter'a taşınan alanlarının parentCode'ları.
/// general_parameter tablosundaki kök satırın <c>code</c> değeri ile birebir.
/// Eski <c>LeadStatus</c> / <c>LeadSource</c> enumlarının yerini alır.
/// </summary>
public static class LeadParameterCodes
{
    public const string Status = "LeadStatus";
    public const string Source = "LeadSource";
}
