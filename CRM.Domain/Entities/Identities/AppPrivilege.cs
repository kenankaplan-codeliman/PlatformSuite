using CRM.Domain.Entities.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Domain.Entities.Identities
{
    public class AppPrivilege : IBaseEntity, IAuditableEntity
    {
        public Guid Id { get; set; }
        public required string PrivilegeCode { get; set; }
        public required string PrivilegeName { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
        public Guid CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
