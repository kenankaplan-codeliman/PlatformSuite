using Platform.Application.Interfaces;
using Platform.Domain.Entities.Activities;
using Platform.Infrastructure.Data;
using Platform.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Platform.Infrastructure.Repositories;

public class PhoneCallActivityRepository : BaseEntityRepository<PhoneCallActivity>, IPhoneCallActivityRepository
{
    public PhoneCallActivityRepository(PlatformDbContext context) : base(context)
    {
    }

    public override async Task<PhoneCallActivity?> GetAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await dbContext.PhoneCallActivity
        .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
    }
}
