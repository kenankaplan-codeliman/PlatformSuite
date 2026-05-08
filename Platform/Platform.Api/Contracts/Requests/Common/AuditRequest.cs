namespace Platform.Api.Contracts.Requests.Common
{
    public class AuditRequest
    {
        public Guid Id { get; set; }
        public string EntityType { get; set; } = string.Empty;
    }
}
