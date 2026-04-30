using Platform.Application.Common.Results;

namespace CodePro.Application.Features.Offers;

public static class OfferErrors
{
    public static readonly Error NotFound =
        new("Offer.NotFound", "Teklif bulunamadı.", ErrorType.NotFound);

    public static readonly Error DuplicateOfferNumber =
        new("Offer.DuplicateOfferNumber", "Aynı numarada başka bir teklif kayıtlı.", ErrorType.Conflict);
}
