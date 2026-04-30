using Platform.Domain.Entities.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace Platform.Domain.Entities.Identities
{
    public class AppUserRole : IBaseEntity
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid RoleId { get; set; }
        public bool IsActive { get; private set; } = true;  
    }
}
