namespace CRM.Api.Contracts.Requests.Common;

public class IdListRequest
{
    public List<Guid> Ids { get; set; } = new List<Guid>();
}
