using Platform.Domain.Enums;

namespace Platform.Api.Contracts.Requests.Common
{
    public class AuditRequest
    {
        public Guid Id { get; set; }
        public EntityType EntityType { get; set; }  
    }
}
