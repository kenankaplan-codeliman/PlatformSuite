using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.PurchaseBaskets;
using Platform.Infrastructure.Data;
using Platform.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Infrastructure.Repositories;

public class PurchaseBasketRepository : BaseEntityRepository<PurchaseBasket>, IPurchaseBasketRepository
{
    public PurchaseBasketRepository(PlatformDbContext dbContext) : base(dbContext)
    {
    }

    public override async Task<PurchaseBasket?> GetAsync(Guid Id, CancellationToken cancellationToken = default)
    {
        return await dbSet.FirstOrDefaultAsync(b => b.Id == Id, cancellationToken);
    }
}
