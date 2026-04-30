using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Products;
using Platform.Infrastructure.Data;
using Platform.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Infrastructure.Repositories;

public class PriceListRepository : BaseEntityRepository<PriceList>, IPriceListRepository
{
    public PriceListRepository(PlatformDbContext dbContext) : base(dbContext)
    {
    }

    public override async Task<PriceList?> GetAsync(Guid Id, CancellationToken cancellationToken = default)
    {
        return await dbSet
            .Include(p => p.SupplierAccount)
            .FirstOrDefaultAsync(p => p.Id == Id, cancellationToken);
    }
}
