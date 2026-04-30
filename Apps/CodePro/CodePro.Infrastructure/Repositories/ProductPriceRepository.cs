using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Products;
using Platform.Infrastructure.Data;
using Platform.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Infrastructure.Repositories;

public class ProductPriceRepository : BaseEntityRepository<ProductPrice>, IProductPriceRepository
{
    public ProductPriceRepository(PlatformDbContext dbContext) : base(dbContext)
    {
    }

    public override async Task<ProductPrice?> GetAsync(Guid Id, CancellationToken cancellationToken = default)
    {
        return await dbSet
            .Include(p => p.Product)
            .Include(p => p.SupplierAccount)
            .Include(p => p.PriceList)
            .FirstOrDefaultAsync(p => p.Id == Id, cancellationToken);
    }
}
