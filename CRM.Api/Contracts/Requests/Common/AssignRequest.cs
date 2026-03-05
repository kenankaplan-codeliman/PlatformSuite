namespace CRM.Api.Contracts.Requests.Common
{
    public class AssignRequest
    {
        public Guid EntityId { get; set; }
        public Guid OwnerId { get; set; }
    }
}
