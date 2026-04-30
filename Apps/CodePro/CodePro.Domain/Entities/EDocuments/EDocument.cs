using Platform.Domain.Entities.Common;
using Platform.Domain.Enums;
using CodePro.Domain.Enums;

namespace CodePro.Domain.Entities.EDocuments
{
    public class EDocument : IBaseEntity, ISoftDeleteEntity, IAuditableEntity, IOwnedEntity
    {
        public Guid Id { get; set; }

        public string Subject { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DocumentType DocumentType { get; set; }
        public EDocumentStatus Status { get; set; } = EDocumentStatus.Sent;

        public string EntityType { get; set; } = string.Empty;
        public Guid EntityId { get; set; }

        public string? AttachmentUrl { get; set; }

        public bool IsActive { get; private set; } = true;

        public Guid CreatedBy { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public Guid? UpdatedBy { get; private set; }
        public DateTime? UpdatedAt { get; private set; }

        public bool IsDeleted { get; private set; }
        public Guid? DeletedBy { get; private set; }
        public DateTime? DeletedAt { get; private set; }

        public Guid OwnerId { get; private set; }
        public Guid OrganizationId { get; private set; }

        public string? RoutingType { get; set; }
        public string? RoutingGroups { get; set; }
        public string? RoutingPersonIds { get; set; }
        public string? RoutingPersonNames { get; set; }
    }
}
