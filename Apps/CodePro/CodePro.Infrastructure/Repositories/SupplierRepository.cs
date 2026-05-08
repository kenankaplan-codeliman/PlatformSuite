using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Suppliers;
using Microsoft.EntityFrameworkCore;
using Platform.Infrastructure.Data;
using Platform.Infrastructure.Data.Repositories;

namespace CodePro.Infrastructure.Repositories;

public class SupplierRepository : BaseEntityRepository<Supplier>, ISupplierRepository
{
    public SupplierRepository(PlatformDbContext dbContext) : base(dbContext)
    {
    }

    public override async Task<Supplier?> GetAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await dbSet.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
    }
}
