namespace CRM.Api.Contracts.Requests.Common
{
    public class AssignListRequest
    {
        public List<AssignRequest> Owners { get; set; } = new ();
    }
}
