using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Products;
using Platform.Infrastructure.Data;
using Platform.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Infrastructure.Repositories;

public class ProductCategoryRepository : BaseEntityRepository<ProductCategory>, IProductCategoryRepository
{
    public ProductCategoryRepository(PlatformDbContext dbContext) : base(dbContext)
    {
    }

    public override async Task<ProductCategory?> GetAsync(Guid Id, CancellationToken cancellationToken = default)
    {
        return await dbSet
            .Include(c => c.ParentCategory)
            .FirstOrDefaultAsync(c => c.Id == Id, cancellationToken);
    }
}
