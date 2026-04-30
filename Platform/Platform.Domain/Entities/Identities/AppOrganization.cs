using Platform.Domain.Entities.Common;
using Platform.Domain.Enums;
using System;

namespace Platform.Domain.Entities.Identities
{
    public class AppOrganization : IBaseEntity, IAuditableEntity, ISoftDeleteEntity
    {
        public Guid Id { get; set; }
        public required string OrganizationCode { get; set; }
        public required string OrganizationName { get; set; }
        public string Description { get; set; } = string.Empty;

        // Hiyerarşik birim — parent zincirinden hesaplanan başlık (örn: "Holding \ Şirket \ Şube").
        public string? Title { get; set; }

        public OrganizationType Type { get; set; } = OrganizationType.DEPARTMENT;
        public string? CostCenter { get; set; }

        public Guid? ParentOrganizationId { get; set; }

        // Yetkilendirme/raporlama zinciri — bu birim hangi birime raporluyor.
        public Guid? ReportsTo { get; set; }

        public bool IsDefault { get; set; } = false;
        public bool IsActive { get; private set; } = true;

        // IAuditableEntity
        public Guid CreatedBy { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public Guid? UpdatedBy { get; private set; }
        public DateTime? UpdatedAt { get; private set; }

        // ISoftDeleteEntity
        public bool IsDeleted { get; private set; }
        public Guid? DeletedBy { get; private set; }
        public DateTime? DeletedAt { get; private set; }

    }
}
