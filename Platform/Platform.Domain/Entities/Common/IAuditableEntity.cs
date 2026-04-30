using System;
using System.Collections.Generic;
using System.Text;

namespace Platform.Domain.Entities.Common
{
    public interface IAuditableEntity
    {
        Guid CreatedBy { get; }
        DateTime CreatedAt { get; }
        Guid? UpdatedBy { get; }
        DateTime? UpdatedAt { get; }
    }
}
