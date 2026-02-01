using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Domain.Entities.Common
{
    public interface IOwnedEntity
    {
        Guid OwnerId { get; set; }
        Guid OrganizationId { get; set; }
    }
}
