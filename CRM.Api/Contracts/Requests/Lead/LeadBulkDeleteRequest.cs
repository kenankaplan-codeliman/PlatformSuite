namespace CRM.Api.Contracts.Requests.Lead
{
    public class LeadBulkDeleteRequest
    {
        public List<Guid> Ids { get; set; } = new List<Guid>(); 
    }
}
