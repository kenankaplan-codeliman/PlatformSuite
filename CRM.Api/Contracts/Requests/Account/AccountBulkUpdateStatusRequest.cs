using CRM.Domain.Enums;

namespace CRM.Api.Contracts.Requests.Account
{
    public class AccountBulkUpdateStatusRequest
    {
        public List<Guid> Ids { get; set; } = [];
        public AccountStatus Status { get; set; }
    }
}
