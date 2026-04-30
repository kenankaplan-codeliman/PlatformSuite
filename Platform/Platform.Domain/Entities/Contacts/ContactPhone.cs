using Platform.Domain.Entities.Communications;

namespace Platform.Domain.Entities.Contacts;

public class ContactPhone : PhoneBase
{
    public Guid ContactId { get; set; }
    public Contact Contact { get; set; } = null!;
}
