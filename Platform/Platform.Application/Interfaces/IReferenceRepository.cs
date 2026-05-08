using Platform.Application.Modals.Common;

namespace Platform.Application.Interfaces
{
    public interface IReferenceRepository
    {
        EntityReferenceList LookupReference(string entityType, string searchText, PaginationInfo paginationInfo);
        EntityReference GetReference(string entityType, Guid Id);
    }
}
