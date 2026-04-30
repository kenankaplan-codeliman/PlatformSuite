using Platform.Domain.Entities.Communications;

namespace Platform.Domain.Entities.Accounts;

public class AccountEmail : EmailBase
{
    public Guid AccountId { get; set; }
    public Account Account { get; set; } = null!;
}
