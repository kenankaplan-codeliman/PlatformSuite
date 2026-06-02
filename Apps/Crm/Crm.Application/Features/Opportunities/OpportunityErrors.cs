using Platform.Application.Common.Results;

namespace Crm.Application.Features.Opportunities;

public static class OpportunityErrors
{
    public static readonly Error NotFound =
        new("Opportunity.NotFound", "Fırsat bulunamadı.", ErrorType.NotFound);

    public static readonly Error InvalidProbability =
        new("Opportunity.InvalidProbability", "Olasılık 0 ile 100 arasında olmalı.", ErrorType.Validation);

    public static readonly Error InvalidStage =
        new("Opportunity.InvalidStage", "Geçersiz fırsat aşaması.", ErrorType.Validation);

    public static readonly Error InvalidCurrency =
        new("Opportunity.InvalidCurrency", "Geçersiz para birimi.", ErrorType.Validation);

    public static readonly Error ProductNotFound =
        new("Opportunity.ProductNotFound", "Satır kalemindeki ürün bulunamadı.", ErrorType.Validation);
}
