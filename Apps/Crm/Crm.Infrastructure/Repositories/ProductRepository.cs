using Crm.Application.Interfaces;
using Crm.Domain.Entities.Products;
using Platform.Infrastructure.Data;
using Platform.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Crm.Infrastructure.Repositories;

public class ProductRepository : BaseEntityRepository<Product>, IProductRepository
{
    public ProductRepository(PlatformDbContext dbContext) : base(dbContext)
    {
    }

    public override async Task<Product?> GetAsync(Guid Id, CancellationToken cancellationToken = default)
    {
        return await dbSet
            .FirstOrDefaultAsync(p => p.Id == Id, cancellationToken);
    }
}
