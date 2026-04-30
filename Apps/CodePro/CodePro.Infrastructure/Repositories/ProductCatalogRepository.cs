using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Products;
using Platform.Infrastructure.Data;
using Platform.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Infrastructure.Repositories;

public class ProductCatalogRepository : BaseEntityRepository<ProductCatalog>, IProductCatalogRepository
{
    public ProductCatalogRepository(PlatformDbContext dbContext) : base(dbContext)
    {
    }

    public override async Task<ProductCatalog?> GetAsync(Guid Id, CancellationToken cancellationToken = default)
    {
        return await dbSet.FirstOrDefaultAsync(c => c.Id == Id, cancellationToken);
    }
}
