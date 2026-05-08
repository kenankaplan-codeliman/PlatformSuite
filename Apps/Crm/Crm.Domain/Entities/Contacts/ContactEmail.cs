using Platform.Domain.Entities.Communications;

namespace Crm.Domain.Entities.Contacts;

public class ContactEmail : EmailBase
{
    public Guid ContactId { get; set; }
    public Contact Contact { get; set; } = null!;
}
