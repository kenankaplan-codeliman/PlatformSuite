using Platform.Application.Modals.Common;
using Platform.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Platform.Application.Interfaces
{
    public interface IReferenceRepository
    {
        EntityReferenceList LookupReference(EntityType entityType, string searchText, PaginationInfo paginationInfo);
        EntityReference GetReference(EntityType entityType, Guid Id);
    }
}
