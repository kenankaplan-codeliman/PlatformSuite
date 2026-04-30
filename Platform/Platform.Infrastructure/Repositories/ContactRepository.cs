using Platform.Application.Interfaces;
using Platform.Domain.Entities.Contacts;
using Platform.Infrastructure.Data;
using Platform.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Platform.Infrastructure.Repositories;

public class ContactRepository : BaseEntityRepository<Contact>, IContactRepository
{
    public ContactRepository(PlatformDbContext dbContext) : base(dbContext)
    {
    }

    public override async Task<Contact?> GetAsync(Guid Id, CancellationToken cancellationToken = default)
    {
        return await this.dbContext.Contact
            .Include(c => c.Emails)
            .Include(c => c.Phones)
            .Include(c => c.Addresses)
            .Include(c => c.AccountContacts).ThenInclude(ac => ac.Account)
            .FirstOrDefaultAsync(e => e.Id == Id, cancellationToken);
    }
}
