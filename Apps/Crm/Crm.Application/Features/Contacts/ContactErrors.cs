using Platform.Application.Common.Results;

namespace Crm.Application.Features.Contacts;

public static class ContactErrors
{
    public static readonly Error NotFound =
        new("Contact.NotFound", "Kişi bulunamadı.", ErrorType.NotFound);

    public static readonly Error InvalidStatus =
        new("Contact.InvalidStatus", "Geçersiz kişi durumu.", ErrorType.Validation);
}
