using CRM.Application.Modals.AccountModal;
using CRM.Application.Modals.LeadModal;

namespace CRM.Api.Contracts.Requests.Account
{
    public class AccountListRequest
    {
        public int Page { get; set; }
        public int PageSize { get; set; }
        public AccountListFilter filters { get; set; } = new AccountListFilter();
    }
}
