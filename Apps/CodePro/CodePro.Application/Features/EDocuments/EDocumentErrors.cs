using Platform.Application.Common.Results;

namespace CodePro.Application.Features.EDocuments;

public static class EDocumentErrors
{
    public static readonly Error NotFound =
        new("EDocument.NotFound", "E-belge bulunamadı.", ErrorType.NotFound);
}
