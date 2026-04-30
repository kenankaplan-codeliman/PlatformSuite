using Platform.Application.Common.Results;

namespace CodePro.Application.Features.ProductCatalogs;

public static class ProductCatalogErrors
{
    public static readonly Error NotFound =
        new("ProductCatalog.NotFound", "Katalog bulunamadı.", ErrorType.NotFound);

    public static readonly Error DuplicateCode =
        new("ProductCatalog.DuplicateCode", "Aynı kodla başka bir katalog kayıtlı.", ErrorType.Conflict);

    public static readonly Error InvalidValidityRange =
        new("ProductCatalog.InvalidValidityRange", "Geçerlilik bitiş tarihi başlangıç tarihinden küçük olamaz.", ErrorType.Validation);
}
