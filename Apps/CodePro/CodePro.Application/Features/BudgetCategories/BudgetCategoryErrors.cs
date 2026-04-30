using Platform.Application.Common.Results;

namespace CodePro.Application.Features.BudgetCategories;

public static class BudgetCategoryErrors
{
    public static readonly Error NotFound =
        new("BudgetCategory.NotFound", "Bütçe kategorisi bulunamadı.", ErrorType.NotFound);

    public static readonly Error DuplicateName =
        new("BudgetCategory.DuplicateName", "Aynı parent altında aynı isimde başka bir kategori kayıtlı.", ErrorType.Conflict);

    public static readonly Error CircularParent =
        new("BudgetCategory.CircularParent", "Kategori kendisini parent olarak alamaz.", ErrorType.Validation);

    public static readonly Error ParentNotFound =
        new("BudgetCategory.ParentNotFound", "Üst kategori bulunamadı.", ErrorType.Validation);
}
