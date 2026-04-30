using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Products;
using Platform.Infrastructure.Data;
using Platform.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Infrastructure.Repositories;

public class BrandRepository : BaseEntityRepository<Brand>, IBrandRepository
{
    public BrandRepository(PlatformDbContext dbContext) : base(dbContext)
    {
    }

    public override async Task<Brand?> GetAsync(Guid Id, CancellationToken cancellationToken = default)
    {
        return await dbSet.FirstOrDefaultAsync(b => b.Id == Id, cancellationToken);
    }
}
