using CRM.Application.Modals.Common;
using CRM.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Interfaces
{
    public interface IReferenceRepository
    {
        EntityReferenceList LookupReference(EntityType entityType, string searchText, PaginationInfo paginationInfo);
        EntityReference GetReference(EntityType entityType, Guid Id);
    }
}
