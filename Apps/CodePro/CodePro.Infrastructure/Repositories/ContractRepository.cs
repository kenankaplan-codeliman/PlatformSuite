using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Contracts;
using Platform.Infrastructure.Data;
using Platform.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Infrastructure.Repositories;

public class ContractRepository : BaseEntityRepository<Contract>, IContractRepository
{
    public ContractRepository(PlatformDbContext dbContext) : base(dbContext)
    {
    }

    public override async Task<Contract?> GetAsync(Guid Id, CancellationToken cancellationToken = default)
    {
        return await dbSet.FirstOrDefaultAsync(c => c.Id == Id, cancellationToken);
    }
}
