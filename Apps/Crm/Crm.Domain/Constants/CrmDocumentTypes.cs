namespace Crm.Domain.Constants;

/// <summary>
/// CRM doküman tiplerinin numarator anahtarları. Magic string yerine
/// merkezi sabitler — <c>INumberGeneratorService.GenerateAsync</c> ve
/// <c>INumberFormatStrategy.DocumentType</c> bu değerleri kullanır.
/// </summary>
public static class CrmDocumentTypes
{
    public const string Opportunity = "OPPORTUNITY";
}
