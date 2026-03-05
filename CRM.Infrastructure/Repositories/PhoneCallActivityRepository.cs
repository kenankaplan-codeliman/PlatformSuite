using CRM.Application.Interfaces;
using CRM.Domain.Entities.Activities;
using CRM.Infrastructure.Data;
using CRM.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories;

public class PhoneCallActivityRepository : BaseEntityRepository<PhoneCallActivity>, IPhoneCallActivityRepository
{
    public PhoneCallActivityRepository(DatabaseContext context) : base(context)
    {
    }

    public override async Task<PhoneCallActivity?> GetAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await dbContext.PhoneCallActivity
        .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
    }
}
