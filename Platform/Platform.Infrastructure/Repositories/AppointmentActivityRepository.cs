using Platform.Application.Interfaces;
using Platform.Domain.Entities.Activities;
using Platform.Infrastructure.Data;
using Platform.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Platform.Infrastructure.Repositories;

public class AppointmentActivityRepository : BaseEntityRepository<AppointmentActivity>, IAppointmentActivityRepository
{
    public AppointmentActivityRepository(PlatformDbContext context) : base(context)
    {
    }

    public override async Task<AppointmentActivity?> GetAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await dbContext.AppointmentActivity
        .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
    }
}
