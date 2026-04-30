using Platform.Application.Common.Results;

namespace CodePro.Application.Features.PriceLists;

public static class PriceListErrors
{
    public static readonly Error NotFound =
        new("PriceList.NotFound", "Fiyat listesi bulunamadı.", ErrorType.NotFound);

    public static readonly Error DuplicateCode =
        new("PriceList.DuplicateCode", "Aynı kodla başka bir fiyat listesi kayıtlı.", ErrorType.Conflict);

    public static readonly Error SupplierNotFound =
        new("PriceList.SupplierNotFound", "Tedarikçi bulunamadı.", ErrorType.Validation);
}
