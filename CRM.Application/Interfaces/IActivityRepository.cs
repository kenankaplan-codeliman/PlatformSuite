using CRM.Application.Modals.ActivityModal;
using CRM.Application.Modals.Common;
using CRM.Domain.Entities.Activities;
using CRM.Domain.Enums;

namespace CRM.Application.Interfaces
{
    public interface IActivityRepository
    {
        Task<ActivityListResponse> ListAsync(ActivityListFilters filter, PaginationInfo paginationInfo, CancellationToken cancellationToken = default);
        Task<List<ActivityListItem>> CalendarAsync(ActivityListFilters filters, DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default);
        Task<List<ActivityListItem>> UpcomingActivitiesAsync(CancellationToken cancellationToken = default);
        Task<ActivityType> GetActivityTypeAsync(Guid Id, CancellationToken cancellationToken = default);
    }
}
