using Crm.Domain.Entities.Accounts;
using Platform.Application.Interfaces;

namespace Crm.Application.Interfaces;

public interface IAccountRepository : IEntityRepository<Account>
{
    // List sorgusu IApplicationDbContext + Mapster projection üzerinden query handler'da.
    // Write path metotları (Create/Update/Delete/Assign/SetState/GetAsync) IEntityRepository'den.
}
