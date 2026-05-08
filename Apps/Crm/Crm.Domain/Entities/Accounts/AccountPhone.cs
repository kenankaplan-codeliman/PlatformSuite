using Platform.Domain.Entities.Communications;

namespace Crm.Domain.Entities.Accounts;

public class AccountPhone : PhoneBase
{
    public Guid AccountId { get; set; }
    public Account Account { get; set; } = null!;
}
