using Platform.Domain.Entities.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace Platform.Domain.Entities.Identities
{
    public class AuthPrivilege : IBaseEntity, IAuditableEntity
    {
        public Guid Id { get; set; }
        public required string PrivilegeCode { get; set; }
        public required string PrivilegeName { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; private set; } = true;
        public Guid CreatedBy { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public Guid? UpdatedBy { get; private set; }
        public DateTime? UpdatedAt { get; private set; }
    }
}
