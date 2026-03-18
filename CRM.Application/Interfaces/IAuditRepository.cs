using CRM.Application.Modals.Common;
using CRM.Domain.Entities.Common;
using CRM.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Interfaces
{
    public interface IAuditRepository
    {
        Task<AuditInfo?> GetAsync<T>(Guid Id, CancellationToken cancellationToken = default)
        where T : class, IBaseEntity;
    }
}
