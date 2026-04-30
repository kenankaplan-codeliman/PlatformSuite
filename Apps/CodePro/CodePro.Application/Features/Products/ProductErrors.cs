using Platform.Application.Common.Results;

namespace CodePro.Application.Features.Products;

public static class ProductErrors
{
    public static readonly Error NotFound =
        new("Product.NotFound", "Ürün bulunamadı.", ErrorType.NotFound);

    public static readonly Error DuplicateCode =
        new("Product.DuplicateCode", "Aynı kodla başka bir ürün kayıtlı.", ErrorType.Conflict);

    public static readonly Error CategoryNotFound =
        new("Product.CategoryNotFound", "Ürün kategorisi bulunamadı.", ErrorType.Validation);

    public static readonly Error InvalidValidityRange =
        new("Product.InvalidValidityRange", "Geçerlilik bitiş tarihi başlangıç tarihinden küçük olamaz.", ErrorType.Validation);
}
