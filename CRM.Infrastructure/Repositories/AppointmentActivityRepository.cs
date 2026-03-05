using CRM.Application.Interfaces;
using CRM.Domain.Entities.Activities;
using CRM.Infrastructure.Data;
using CRM.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories;

public class AppointmentActivityRepository : BaseEntityRepository<AppointmentActivity>, IAppointmentActivityRepository
{
    public AppointmentActivityRepository(DatabaseContext context) : base(context)
    {
    }

    public override async Task<AppointmentActivity?> GetAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await dbContext.AppointmentActivity
        .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
    }
}
