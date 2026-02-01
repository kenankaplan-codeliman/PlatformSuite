namespace CRM.Api.Contracts.Requests
{
    public class LeadBulkDeleteRequest
    {
        public List<Guid> Ids { get; set; } = new List<Guid>(); 
    }
}
