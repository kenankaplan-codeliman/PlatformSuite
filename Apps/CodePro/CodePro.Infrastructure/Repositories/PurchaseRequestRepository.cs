using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.PurchaseRequests;
using Platform.Infrastructure.Data;
using Platform.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Infrastructure.Repositories;

public class PurchaseRequestRepository : BaseEntityRepository<PurchaseRequest>, IPurchaseRequestRepository
{
    public PurchaseRequestRepository(PlatformDbContext dbContext) : base(dbContext)
    {
    }

    public override async Task<PurchaseRequest?> GetAsync(Guid Id, CancellationToken cancellationToken = default)
    {
        return await dbSet.FirstOrDefaultAsync(p => p.Id == Id, cancellationToken);
    }
}
