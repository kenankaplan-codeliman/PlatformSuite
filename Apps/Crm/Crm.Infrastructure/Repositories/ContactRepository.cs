using Crm.Application.Interfaces;
using Crm.Domain.Entities.Contacts;
using Crm.Infrastructure.Data;
using Platform.Application.Interfaces;
using Platform.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Crm.Infrastructure.Repositories;

public class ContactRepository : BaseEntityRepository<Contact>, IContactRepository
{
    private readonly CrmDbContext crmDbContext;

    public ContactRepository(CrmDbContext dbContext) : base(dbContext)
    {
        this.crmDbContext = dbContext;
    }

    public override async Task<Contact?> GetAsync(Guid Id, CancellationToken cancellationToken = default)
    {
        return await this.crmDbContext.Contact
            .Include(c => c.AccountContacts).ThenInclude(ac => ac.Account)
            .FirstOrDefaultAsync(e => e.Id == Id, cancellationToken);
    }
}
