using Platform.Application.Modals.ActivityModal;
using Platform.Application.Modals.Common;
using Platform.Domain.Entities.Accounts;
using Platform.Domain.Entities.Activities;
using Platform.Domain.Enums;

namespace Platform.Application.Interfaces
{
    public interface IActivityRepository : IEntityRepository<ActivityBase>
    {
        Task<ActivityListResponse> ListAsync(ActivityListFilters filter, PaginationInfo paginationInfo, CancellationToken cancellationToken = default);
        Task<List<ActivityListItem>> CalendarAsync(ActivityListFilters filters, DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default);
        Task<List<ActivityListItem>> UpcomingActivitiesAsync(CancellationToken cancellationToken = default);
        Task<ActivityType> GetActivityTypeAsync(Guid Id, CancellationToken cancellationToken = default);
    }
}
