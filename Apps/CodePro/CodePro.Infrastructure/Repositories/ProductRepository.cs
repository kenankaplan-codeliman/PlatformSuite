using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Products;
using Platform.Infrastructure.Data;
using Platform.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Infrastructure.Repositories;

public class ProductRepository : BaseEntityRepository<Product>, IProductRepository
{
    public ProductRepository(PlatformDbContext dbContext) : base(dbContext)
    {
    }

    public override async Task<Product?> GetAsync(Guid Id, CancellationToken cancellationToken = default)
    {
        return await dbSet
            .Include(p => p.ProductCategory)
            .FirstOrDefaultAsync(p => p.Id == Id, cancellationToken);
    }
}
