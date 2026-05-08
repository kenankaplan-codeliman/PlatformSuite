using Crm.Domain.Entities.Contacts;
using Platform.Application.Interfaces;

namespace Crm.Application.Interfaces;

public interface IContactRepository : IEntityRepository<Contact>
{
    // List sorgusu IApplicationDbContext + Mapster projection üzerinden query handler'da.
}
