using CRM.Domain.Entities.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Domain.Entities.Identities
{
    public class AppOrganization : IBaseEntity, IAuditableEntity, ISoftDeleteEntity
    {
        public Guid Id { get; set; }
        public required string OrganizationCode { get; set; }
        public required string OrganizationName { get; set; }
        public string Description { get; set; } = string.Empty;
        public Guid? ParentOrganizationId { get; set; }
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
