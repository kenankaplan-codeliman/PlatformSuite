using Platform.Application.Common.Results;

namespace CodePro.Application.Features.PurchaseRequests;

public static class PurchaseRequestErrors
{
    public static readonly Error NotFound =
        new("PurchaseRequest.NotFound", "Satın alma talebi bulunamadı.", ErrorType.NotFound);

    public static readonly Error DuplicateRequestNumber =
        new("PurchaseRequest.DuplicateRequestNumber", "Aynı numarada başka bir talep kayıtlı.", ErrorType.Conflict);
}
