using CRM.Application.Interfaces;
using CRM.Domain.Entities.Activities;
using CRM.Infrastructure.Data;
using CRM.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories;

public class EmailActivityRepository : BaseEntityRepository<EmailActivity>, IEmailActivityRepository
{
    public EmailActivityRepository(DatabaseContext context) : base(context)
    {
    }

    public override async Task<EmailActivity?> GetAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await dbContext.EmailActivity
        .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
    }
}