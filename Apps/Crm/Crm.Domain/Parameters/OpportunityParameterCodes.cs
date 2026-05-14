namespace Crm.Domain.Parameters;

/// <summary>
/// Opportunity entity'sinin GeneralParameter'a taşınan alanlarının parentCode'ları.
/// general_parameter tablosundaki kök satırın <c>code</c> değeri ile birebir.
/// Eski <c>OpportunityStage</c> enumunun yerini alır.
/// </summary>
public static class OpportunityParameterCodes
{
    public const string Stage = "OpportunityStage";
}
