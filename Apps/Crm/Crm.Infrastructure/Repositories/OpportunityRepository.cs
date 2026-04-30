using Crm.Application.Interfaces;
using Crm.Domain.Entities.Opportunities;
using Platform.Infrastructure.Data;
using Platform.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Crm.Infrastructure.Repositories;

public class OpportunityRepository : BaseEntityRepository<Opportunity>, IOpportunityRepository
{
    public OpportunityRepository(PlatformDbContext dbContext) : base(dbContext)
    {
    }

    public override async Task<Opportunity?> GetAsync(Guid Id, CancellationToken cancellationToken = default)
    {
        return await dbSet
            .Include(o => o.Account)
            .Include(o => o.PrimaryContact)
            .FirstOrDefaultAsync(o => o.Id == Id, cancellationToken);
    }
}
