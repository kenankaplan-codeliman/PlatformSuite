namespace Platform.Api.Contracts.Requests.Common;

public class IdListRequest
{
    public List<Guid> Ids { get; set; } = new();
}
