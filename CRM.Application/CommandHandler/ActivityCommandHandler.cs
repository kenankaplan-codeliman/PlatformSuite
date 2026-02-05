
using CRM.Application.Exceptions;
using CRM.Application.Interfaces;
using CRM.Application.Modals.Common;
using CRM.Application.Modals.ActivityModal;
using CRM.Domain.Enums;

namespace CRM.Application.CommandHandler;

public class ActivityCommandHandler
{
    private readonly IUnitOfWork unitOfWork;
    private readonly IActivityRepository activityRepository;

    public ActivityCommandHandler(IActivityRepository activityRepository, IUnitOfWork unitOfWork)
    {
        this.activityRepository = activityRepository;
        this.unitOfWork = unitOfWork;
    }

    public async Task<List<ActivityBaseModal>> Calendar(ActivityListFilters? filters, DateTime startDate, DateTime endDate)
    {
        var result = activityRepository.Calendar(filters, startDate, endDate);

        return result;
    }

    public async Task<ActivityListResponse> List(ActivityListFilters? filters, PaginationInfo? paginationInfo)
    {
        var result = activityRepository.List(filters, paginationInfo);

        return result;
    }


}
