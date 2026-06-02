using Platform.Application.Common.Results;

namespace Crm.Application.Features.Leads;

public static class LeadErrors
{
    public static readonly Error NotFound =
        new("Lead.NotFound", "Aday bulunamadı.", ErrorType.NotFound);

    public static readonly Error InvalidStatus =
        new("Lead.InvalidStatus", "Geçersiz aday durumu.", ErrorType.Validation);

    public static readonly Error InvalidSource =
        new("Lead.InvalidSource", "Geçersiz aday kaynağı.", ErrorType.Validation);

    public static readonly Error InvalidCurrency =
        new("Lead.InvalidCurrency", "Geçersiz para birimi.", ErrorType.Validation);
}
