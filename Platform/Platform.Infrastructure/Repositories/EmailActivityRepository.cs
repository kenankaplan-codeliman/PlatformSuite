using Platform.Application.Interfaces;
using Platform.Domain.Entities.Activities;
using Platform.Infrastructure.Data;
using Platform.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Platform.Infrastructure.Repositories;

public class EmailActivityRepository : BaseEntityRepository<EmailActivity>, IEmailActivityRepository
{
    public EmailActivityRepository(PlatformDbContext context) : base(context)
    {
    }

    public override async Task<EmailActivity?> GetAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await dbContext.EmailActivity
        .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
    }
}