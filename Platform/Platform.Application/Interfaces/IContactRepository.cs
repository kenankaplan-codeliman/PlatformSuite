using Platform.Domain.Entities.Contacts;

namespace Platform.Application.Interfaces;

public interface IContactRepository : IEntityRepository<Contact>
{
    // List sorgusu IApplicationDbContext + Mapster projection üzerinden query handler'da.
}
