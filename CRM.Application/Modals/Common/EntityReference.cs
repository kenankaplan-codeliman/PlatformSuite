using CRM.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Modals.Common
{
    public class EntityReference
    {
        public EntityReference(EntityType entityType)
        {
            EntityType = entityType.ToString();
        }

        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Company { get; set; }
        public string EntityType { get; private set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
    }
}
