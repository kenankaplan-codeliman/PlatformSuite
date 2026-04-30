using System;
using System.Collections.Generic;
using System.Text;

namespace Platform.Domain.Entities.Common
{
    public interface IOwnedEntity
    {
        Guid OwnerId { get; }
        Guid OrganizationId { get; }
    }
}
