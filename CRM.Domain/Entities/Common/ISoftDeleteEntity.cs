using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Domain.Entities.Common
{
    public interface ISoftDeleteEntity
    {
        bool IsDeleted { get; }
        Guid? DeletedBy { get; }
        DateTime? DeletedAt { get; }
    }
}
