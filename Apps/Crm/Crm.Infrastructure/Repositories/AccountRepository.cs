using Crm.Application.Interfaces;
using Crm.Application.Features.Accounts;
using Crm.Domain.Entities.Accounts;
using Crm.Infrastructure.Data;
using Platform.Application.Interfaces;
using Platform.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Crm.Infrastructure.Repositories;

public class AccountRepository : BaseEntityRepository<Account>, IAccountRepository
{
    private readonly CrmDbContext crmDbContext;

    public AccountRepository(CrmDbContext dbContext) : base(dbContext)
    {
        this.crmDbContext = dbContext;
    }

    public override async Task<Account?> GetAsync(Guid Id, CancellationToken cancellationToken = default)
    {
        return await this.crmDbContext.Account
            .WithDetailIncludes()
            .FirstOrDefaultAsync(e => e.Id == Id, cancellationToken);
    }
}
