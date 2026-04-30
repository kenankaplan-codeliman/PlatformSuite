using Platform.Application.Modals.Common;
using Platform.Domain.Entities.Common;
using Platform.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Platform.Application.Interfaces
{
    public interface IAuditRepository
    {
        Task<AuditInfo?> GetAsync<T>(Guid Id, CancellationToken cancellationToken = default)
        where T : class, IBaseEntity;
    }
}
