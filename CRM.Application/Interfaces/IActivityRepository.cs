using CRM.Application.Modals.ActivityModal;
using CRM.Application.Modals.Common;

namespace CRM.Application.Interfaces
{
    public interface IActivityRepository
    {
        ActivityListResponse List(ActivityListFilters? filter, PaginationInfo? paginationInfo);
        List<ActivityBaseModal> Calendar(ActivityListFilters? filters, DateTime startDate, DateTime endDate);


    }
}
