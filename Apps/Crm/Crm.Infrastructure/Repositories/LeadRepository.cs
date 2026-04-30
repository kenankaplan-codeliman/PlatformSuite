using Crm.Application.Interfaces;
using Crm.Domain.Entities.Leads;
using Platform.Infrastructure.Data;
using Platform.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Crm.Infrastructure.Repositories;

public class LeadRepository : BaseEntityRepository<Lead>, ILeadRepository
{
    public LeadRepository(PlatformDbContext dbContext) : base(dbContext)
    {
    }

    public override async Task<Lead?> GetAsync(Guid Id, CancellationToken cancellationToken = default)
    {
        return await dbSet
            .Include(l => l.ConvertedAccount)
            .Include(l => l.ConvertedContact)
            .FirstOrDefaultAsync(l => l.Id == Id, cancellationToken);
    }
}
