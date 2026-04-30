using Platform.Domain.Entities.Communications;

namespace Platform.Domain.Entities.Accounts;

public class AccountAddress : AddressBase
{
    public Guid AccountId { get; set; }
    public Account Account { get; set; } = null!;
}
