using Platform.Application.Interfaces;
using Platform.Domain.Entities.Activities;
using Platform.Infrastructure.Data;
using Platform.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Platform.Infrastructure.Repositories;

public class TaskActivityRepository : BaseEntityRepository<TaskActivity>, ITaskActivityRepository
{
    public TaskActivityRepository(PlatformDbContext context) : base(context)
    {
    }

    public override async Task<TaskActivity?> GetAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await dbContext.TaskActivity
        .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
    }
}
