using Platform.Domain.Entities.Common;
using Platform.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Platform.Domain.Entities.Identities
{
    public class AppRolePrivilege : IBaseEntity
    {
        public Guid Id { get; set; }
        public required Guid RoleId { get; set; }
        public required string PrivilegeCode { get; set; }
        public required AccessLevel AccessLevel { get; set; } = AccessLevel.None;
        public bool IsActive { get; private set; } = true;

    }
}
