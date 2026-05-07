using Platform.Application.Features.Accounts;
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
            .WithDetailIncludes()
            .FirstOrDefaultAsync(e => e.Id == Id, cancellationToken);
    }
}
