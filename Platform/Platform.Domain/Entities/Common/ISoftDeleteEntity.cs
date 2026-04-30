using System;
using System.Collections.Generic;
using System.Text;

namespace Platform.Domain.Entities.Common
{
    public interface ISoftDeleteEntity
    {
        bool IsDeleted { get; }
        Guid? DeletedBy { get; }
        DateTime? DeletedAt { get; }
    }
}
