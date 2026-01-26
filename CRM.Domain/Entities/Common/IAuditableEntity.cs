using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Domain.Entities.Common
{
    public interface IAuditableEntity
    {
        Guid CreatedBy { get; set; }
        DateTime CreatedAt { get; set; }
        Guid? UpdatedBy { get; set; }
        DateTime? UpdatedAt { get; set; }
    }
}
