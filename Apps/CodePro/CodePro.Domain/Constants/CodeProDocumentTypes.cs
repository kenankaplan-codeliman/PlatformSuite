namespace CodePro.Domain.Constants;

/// <summary>
/// CodePro doküman tiplerinin numarator anahtarları. Magic string yerine
/// merkezi sabitler — <c>INumberGeneratorService.GenerateAsync</c> ve
/// <c>INumberFormatStrategy.DocumentType</c> bu değerleri kullanır.
/// </summary>
public static class CodeProDocumentTypes
{
    public const string PurchaseOrder = "PURCHASE_ORDER";
    public const string Offer = "OFFER";
    public const string Contract = "CONTRACT";
}
