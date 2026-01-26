using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Domain.Entities.Common
{
    public interface IBaseEntity
    {
        Guid Id { get; set; }
        bool IsActive { get; set; }
    }
}
