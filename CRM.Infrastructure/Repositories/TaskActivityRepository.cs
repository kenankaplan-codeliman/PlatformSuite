using CRM.Application.Interfaces;
using CRM.Domain.Entities.Activities;
using CRM.Infrastructure.Data;
using CRM.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories;

public class TaskActivityRepository : BaseEntityRepository<TaskActivity>, ITaskActivityRepository
{
    public TaskActivityRepository(DatabaseContext context) : base(context)
    {
    }

    public override async Task<TaskActivity?> GetAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await dbContext.TaskActivity
        .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
    }
}
