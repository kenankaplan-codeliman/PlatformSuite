using CRM.Domain.Enums;

namespace CRM.Api.Contracts.Requests.Lead
{
    public class LeadBulkUpdateStatusRequest
    {
        public List<Guid> Ids { get; set; } = new List<Guid>();
        public LeadStatus Status { get; set; }
    }
}
