using CRM.Domain.Entities.Common;
using System;
using System.Collections.Generic;
using System.Text;
using System.Xml;

namespace CRM.Domain.Entities.Identity
{
    public class AppRole : IBaseEntity, IAuditableEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public required string RoleName { get; set; }
        public string? Description { get; set; }
        public bool IsDefault { get; set; } = false;
        public bool IsActive { get; set; } = true;
        public Guid CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

}
