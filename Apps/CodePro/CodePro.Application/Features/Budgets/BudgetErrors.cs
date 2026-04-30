using Platform.Application.Common.Results;

namespace CodePro.Application.Features.Budgets;

public static class BudgetErrors
{
    public static readonly Error NotFound =
        new("Budget.NotFound", "Bütçe bulunamadı.", ErrorType.NotFound);

    public static readonly Error InvalidDateRange =
        new("Budget.InvalidDateRange", "Bitiş tarihi başlangıç tarihinden küçük olamaz.", ErrorType.Validation);

    public static readonly Error InvalidTotalAmount =
        new("Budget.InvalidTotalAmount", "Toplam tutar negatif olamaz.", ErrorType.Validation);
}
