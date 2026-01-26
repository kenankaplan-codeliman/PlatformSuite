using CRM.Domain.Entities.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Domain.Entities.Identity
{
    public class AppUserRole : IBaseEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid UserId { get; set; }
        public Guid RoleId { get; set; }
        public bool IsActive { get; set; } = true;  
    }
}
