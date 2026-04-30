using Platform.Application.CommandHandler;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using Platform.Application.Modals.ActivityModal;
using Platform.Application.Modals.Common;
using MediatR;

namespace Platform.Application.Features.Activities.Queries.ListActivities;

public sealed class ListActivitiesQuery : IRequest<Result<PagedResult<ActivityListItem>>>
{
    public PaginationRequest Pagination { get; init; } = new();
    public ActivityListFilters Filters { get; init; } = new();
}

public sealed class ListActivitiesHandler : IRequestHandler<ListActivitiesQuery, Result<PagedResult<ActivityListItem>>>
{
    private readonly ActivityCommandHandler _inner;

    public ListActivitiesHandler(ActivityCommandHandler inner) => _inner = inner;

    public async Task<Result<PagedResult<ActivityListItem>>> Handle(ListActivitiesQuery request, CancellationToken cancellationToken)
    {
        var inner = await _inner.List(
            request.Filters,
            new PaginationInfo(request.Pagination.PageNumber, request.Pagination.PageSize),
            cancellationToken);

        return new PagedResult<ActivityListItem>
        {
            Data = inner.Data,
            Pagination = new PaginationResponse
            {
                PageNumber = inner.Page,
                PageSize = inner.PageSize,
                HasMoreRecord = inner.HasMore,
            },
        };
    }
}
