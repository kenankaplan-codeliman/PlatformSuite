namespace Platform.Api.Contracts.Requests.Common;

public class StatusRequest
{
    public List<Guid> Ids { get; set; } = new();
    public bool IsActive { get; set; }
}
