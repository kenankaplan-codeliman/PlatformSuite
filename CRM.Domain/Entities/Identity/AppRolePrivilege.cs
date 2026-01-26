using CRM.Domain.Entities.Common;
using CRM.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Domain.Entities.Identity
{
    public class AppRolePrivilege : IBaseEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public required Guid RoleId { get; set; }
        public required string PrivilegeCode { get; set; }
        public required AccessLevel AccessLevel { get; set; } = AccessLevel.None;
        public bool IsActive { get; set; } = true;

    }
}
