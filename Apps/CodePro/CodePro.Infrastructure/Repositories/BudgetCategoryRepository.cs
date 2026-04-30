using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Budgets;
using Platform.Infrastructure.Data;
using Platform.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Infrastructure.Repositories;

public class BudgetCategoryRepository : BaseEntityRepository<BudgetCategory>, IBudgetCategoryRepository
{
    public BudgetCategoryRepository(PlatformDbContext dbContext) : base(dbContext)
    {
    }

    public override async Task<BudgetCategory?> GetAsync(Guid Id, CancellationToken cancellationToken = default)
    {
        return await dbSet
            .Include(c => c.ParentCategory)
            .FirstOrDefaultAsync(c => c.Id == Id, cancellationToken);
    }
}
