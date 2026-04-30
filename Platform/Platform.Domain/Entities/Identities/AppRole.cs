using Platform.Domain.Entities.Common;
using System;
using System.Collections.Generic;
using System.Text;
using System.Xml;

namespace Platform.Domain.Entities.Identities
{
    public class AppRole : IBaseEntity, IAuditableEntity
    {
        public Guid Id { get; set; }
        public required string RoleName { get; set; }
        public string? Description { get; set; }
        public bool IsDefault { get; set; } = false;
        public bool IsActive { get; private set; } = true;
        public Guid CreatedBy { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public Guid? UpdatedBy { get; private set; }
        public DateTime? UpdatedAt { get; private set; }
    }

}
