using Platform.Application.Common.Results;

namespace CodePro.Application.Features.ProductCategories;

public static class ProductCategoryErrors
{
    public static readonly Error NotFound =
        new("ProductCategory.NotFound", "Ürün kategorisi bulunamadı.", ErrorType.NotFound);

    public static readonly Error DuplicateName =
        new("ProductCategory.DuplicateName", "Aynı parent altında aynı isimde başka bir kategori kayıtlı.", ErrorType.Conflict);

    public static readonly Error CircularParent =
        new("ProductCategory.CircularParent", "Kategori kendisini parent olarak alamaz.", ErrorType.Validation);

    public static readonly Error ParentNotFound =
        new("ProductCategory.ParentNotFound", "Üst kategori bulunamadı.", ErrorType.Validation);
}
