using CRM.Domain.Entities.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Domain.Entities.Identity
{
    public class AppOrganization : IBaseEntity, IAuditableEntity, ISoftDeleteEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public required string OrganizationCode { get; set; }
        public required string OrganizationName { get; set; }
        public string Description { get; set; } = string.Empty;
        public Guid? ParentOrganizationId { get; set; }
        public bool IsDefault { get; set; } = false;
        public bool IsActive { get; set; } = true;
        
        // IAuditableEntity
        public Guid CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // ISoftDeleteEntity
        public bool IsDeleted { get; set; }
        public Guid? DeletedBy { get; set; }
        public DateTime? DeletedAt { get; set; }

    }
}
