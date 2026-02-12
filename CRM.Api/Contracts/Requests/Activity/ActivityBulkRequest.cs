namespace CRM.Api.Contracts.Requests.Activity
{
    public class ActivityBulkRequest
    {
        public List<Guid> Ids { get; set; } = new List<Guid>();
    }
}
