using Platform.Application.Common.Results;

namespace CodePro.Application.Features.PurchaseBaskets;

public static class PurchaseBasketErrors
{
    public static readonly Error NotFound =
        new("PurchaseBasket.NotFound", "Sepet bulunamadı.", ErrorType.NotFound);
}
