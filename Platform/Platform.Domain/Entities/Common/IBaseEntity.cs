using System;
using System.Collections.Generic;
using System.Text;

namespace Platform.Domain.Entities.Common
{
    public interface IBaseEntity
    {
        Guid Id { get; set; }
        bool IsActive { get; }
    }
}
