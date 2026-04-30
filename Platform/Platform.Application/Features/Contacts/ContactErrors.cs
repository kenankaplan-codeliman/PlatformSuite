using Platform.Application.Common.Results;

namespace Platform.Application.Features.Contacts;

public static class ContactErrors
{
    public static readonly Error NotFound =
        new("Contact.NotFound", "Kişi bulunamadı.", ErrorType.NotFound);
}
