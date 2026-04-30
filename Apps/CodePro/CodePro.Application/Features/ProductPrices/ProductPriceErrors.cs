using Platform.Application.Common.Results;

namespace CodePro.Application.Features.ProductPrices;

public static class ProductPriceErrors
{
    public static readonly Error NotFound =
        new("ProductPrice.NotFound", "Ürün fiyatı bulunamadı.", ErrorType.NotFound);

    public static readonly Error ProductNotFound =
        new("ProductPrice.ProductNotFound", "Ürün bulunamadı.", ErrorType.Validation);

    public static readonly Error SupplierNotFound =
        new("ProductPrice.SupplierNotFound", "Tedarikçi bulunamadı.", ErrorType.Validation);

    public static readonly Error PriceListNotFound =
        new("ProductPrice.PriceListNotFound", "Fiyat listesi bulunamadı.", ErrorType.Validation);

    public static readonly Error InvalidValidityRange =
        new("ProductPrice.InvalidValidityRange", "Geçerlilik bitiş tarihi başlangıç tarihinden küçük olamaz.", ErrorType.Validation);

    public static readonly Error InvalidPrice =
        new("ProductPrice.InvalidPrice", "Birim fiyat sıfırdan büyük olmalıdır.", ErrorType.Validation);
}
