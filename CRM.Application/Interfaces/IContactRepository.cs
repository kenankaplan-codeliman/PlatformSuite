using CRM.Application.Modals.AccountModal;
using CRM.Application.Modals.Common;
using CRM.Application.Modals.ContactModal;
using CRM.Domain.Entities.Contacts;

namespace CRM.Application.Interfaces
{
    public interface IContactRepository : IEntityRepository<Contact>
    {
        Task<PaginationResult<ContactListItem>> List(ContactListFilters filter, PaginationInfo paginationInfo);
    }
}
