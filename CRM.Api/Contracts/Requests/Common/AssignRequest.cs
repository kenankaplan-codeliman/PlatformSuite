namespace CRM.Api.Contracts.Requests.Common;

public class AssignRequest
{
    public List<Guid> Ids { get; set; } = new();
    public Guid OwnerId { get; set; }
}
