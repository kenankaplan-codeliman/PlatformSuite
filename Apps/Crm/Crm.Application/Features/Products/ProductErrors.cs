using Platform.Application.Common.Results;

namespace Crm.Application.Features.Products;

public static class ProductErrors
{
    public static readonly Error NotFound =
        new("Product.NotFound", "Ürün bulunamadı.", ErrorType.NotFound);

    public static readonly Error DuplicateCode =
        new("Product.DuplicateCode", "Bu ürün kodu zaten kullanılıyor.", ErrorType.Conflict);

    public static readonly Error InvalidCategory =
        new("Product.InvalidCategory", "Geçersiz ürün kategorisi.", ErrorType.Validation);

    public static readonly Error InvalidUnitOfMeasure =
        new("Product.InvalidUnitOfMeasure", "Geçersiz ölçü birimi.", ErrorType.Validation);

    public static readonly Error InvalidCurrency =
        new("Product.InvalidCurrency", "Geçersiz para birimi.", ErrorType.Validation);
}
