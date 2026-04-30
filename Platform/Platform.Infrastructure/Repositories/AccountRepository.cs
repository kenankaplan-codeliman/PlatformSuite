using Platform.Application.Interfaces;
using Platform.Domain.Entities.Accounts;
using Platform.Infrastructure.Data;
using Platform.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Platform.Infrastructure.Repositories;

public class AccountRepository : BaseEntityRepository<Account>, IAccountRepository
{
    public AccountRepository(PlatformDbContext dbContext) : base(dbContext)
    {
    }

    public override async Task<Account?> GetAsync(Guid Id, CancellationToken cancellationToken = default)
    {
        return await this.dbContext.Account
            .Include(a => a.Emails)
            .Include(a => a.Phones)
            .Include(a => a.Addresses)
            .Include(a => a.AccountContacts).ThenInclude(ac => ac.Contact)
            .FirstOrDefaultAsync(e => e.Id == Id, cancellationToken);
    }
}
