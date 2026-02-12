using CRM.Application.Modals.AccountModal;
using CRM.Application.Modals.Common;
using CRM.Domain.Entities.Accounts;
using CRM.Domain.Entities.Leads;

namespace CRM.Application.Interfaces
{
    public interface IAccountRepository : IEntityRepository<Account>
    {
        Task<PaginationResult<AccountListItem>> List(AccountListFilter filter, PaginationInfo paginationInfo);
    }
}
