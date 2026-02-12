using CRM.Domain.Enums;

namespace CRM.Api.Contracts.Requests.Activity
{
    public class ActivityBulkUpdateStatusRequest
    {
        public List<Guid> Ids { get; set; } = new List<Guid>();

        public ActivityStatus Status { get; set; } = default;
    }
}
