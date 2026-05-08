using Platform.Domain.Entities.Communications;

namespace Crm.Domain.Entities.Contacts;

public class ContactPhone : PhoneBase
{
    public Guid ContactId { get; set; }
    public Contact Contact { get; set; } = null!;
}
