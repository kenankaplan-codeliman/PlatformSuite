
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
    public async Task<ActivityListResponse> List(ActivityListFilters? filter, PaginationInfo? paginationInfo)
    {
        //var result = await activityRepository.ListAsync(filter, paginationInfo);

        //var modalList = result.Data.Select(e => LeadListItem.fromEntity(e)).ToList();

        return new ActivityListResponse()
        {
            Data = new List<ActivityBaseModal>(),
            HasMore = false,
            Page = 0,//result.Page,
            PageSize =0, //result.PageSize,
        };
    }

}
