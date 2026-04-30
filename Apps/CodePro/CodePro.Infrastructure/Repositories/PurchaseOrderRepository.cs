using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.PurchaseOrders;
using Platform.Infrastructure.Data;
using Platform.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Infrastructure.Repositories;

public class PurchaseOrderRepository : BaseEntityRepository<PurchaseOrder>, IPurchaseOrderRepository
{
    public PurchaseOrderRepository(PlatformDbContext dbContext) : base(dbContext)
    {
    }

    public override async Task<PurchaseOrder?> GetAsync(Guid Id, CancellationToken cancellationToken = default)
    {
        return await dbSet.FirstOrDefaultAsync(p => p.Id == Id, cancellationToken);
    }
}
