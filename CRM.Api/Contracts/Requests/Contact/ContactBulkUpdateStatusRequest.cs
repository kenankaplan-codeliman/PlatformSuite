using CRM.Domain.Enums;

namespace CRM.Api.Contracts.Requests.Contact
{
    public class ContactBulkUpdateStatusRequest
    {
        public List<Guid> Ids { get; set; } = [];
        public ContactStatus Status { get; set; }
    }
}
