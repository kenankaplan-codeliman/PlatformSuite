using Platform.Application.Common.Results;

namespace CodePro.Application.Features.ProductImages;

public static class ProductImageErrors
{
    public static readonly Error NotFound =
        new("ProductImage.NotFound", "Ürün görseli bulunamadı.", ErrorType.NotFound);

    public static readonly Error ProductNotFound =
        new("ProductImage.ProductNotFound", "Ürün bulunamadı.", ErrorType.NotFound);

    public static readonly Error EmptyFile =
        new("ProductImage.EmptyFile", "Yüklenen dosya boş olamaz.", ErrorType.Validation);

    public static readonly Error InvalidContentType =
        new("ProductImage.InvalidContentType", "Yalnızca resim dosyaları yüklenebilir.", ErrorType.Validation);

    public static readonly Error InvalidImage =
        new("ProductImage.InvalidImage", "Resim dosyası okunamadı veya bozuk.", ErrorType.Validation);

    public static readonly Error ReorderMismatch =
        new("ProductImage.ReorderMismatch", "Sıralama listesi ürünün mevcut görselleriyle eşleşmiyor.", ErrorType.Validation);
}
