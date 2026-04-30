using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Products;
using Platform.Infrastructure.Data;
using Platform.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Infrastructure.Repositories;

public class ManufacturerRepository : BaseEntityRepository<Manufacturer>, IManufacturerRepository
{
    public ManufacturerRepository(PlatformDbContext dbContext) : base(dbContext)
    {
    }

    public override async Task<Manufacturer?> GetAsync(Guid Id, CancellationToken cancellationToken = default)
    {
        return await dbSet.FirstOrDefaultAsync(m => m.Id == Id, cancellationToken);
    }
}
