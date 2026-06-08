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

    public static readonly Error InvalidRating =
        new("Lead.InvalidRating", "Geçersiz aday sınıfı.", ErrorType.Validation);

    public static readonly Error InvalidCurrency =
        new("Lead.InvalidCurrency", "Geçersiz para birimi.", ErrorType.Validation);

    // ── Convert ──────────────────────────────────────────────────────────
    public static readonly Error AlreadyConverted =
        new("Lead.AlreadyConverted", "Bu aday zaten dönüştürülmüş.", ErrorType.Conflict);

    public static readonly Error NothingToConvert =
        new("Lead.NothingToConvert", "Dönüştürme için en az bir hedef (Firma veya Kişi) seçilmelidir.", ErrorType.Validation);

    public static readonly Error AccountNotFound =
        new("Lead.AccountNotFound", "Bağlanacak firma bulunamadı.", ErrorType.NotFound);

    public static readonly Error OpportunityRequiresAccount =
        new("Lead.OpportunityRequiresAccount", "Fırsat oluşturmak için bir firma seçilmeli veya oluşturulmalıdır.", ErrorType.Validation);
}
