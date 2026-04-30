using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Budgets;
using Platform.Infrastructure.Data;
using Platform.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Infrastructure.Repositories;

public class BudgetRepository : BaseEntityRepository<Budget>, IBudgetRepository
{
    public BudgetRepository(PlatformDbContext dbContext) : base(dbContext)
    {
    }

    public override async Task<Budget?> GetAsync(Guid Id, CancellationToken cancellationToken = default)
    {
        return await dbSet.FirstOrDefaultAsync(b => b.Id == Id, cancellationToken);
    }
}
