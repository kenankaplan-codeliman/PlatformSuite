using Platform.Application.CommandHandler;
using Platform.Application.Common.Results;
using Platform.Application.Modals.ActivityModal;
using MediatR;

namespace Platform.Application.Features.Activities.Queries.CalendarActivities;

public sealed class CalendarActivitiesQuery : IRequest<Result<List<ActivityListItem>>>
{
    public DateTime StartDate { get; init; } = DateTime.Now;
    public DateTime EndDate { get; init; } = DateTime.Now;
    public ActivityListFilters? Filters { get; init; }
}

public sealed class CalendarActivitiesHandler : IRequestHandler<CalendarActivitiesQuery, Result<List<ActivityListItem>>>
{
    private readonly ActivityCommandHandler _inner;

    public CalendarActivitiesHandler(ActivityCommandHandler inner) => _inner = inner;

    public async Task<Result<List<ActivityListItem>>> Handle(CalendarActivitiesQuery request, CancellationToken cancellationToken)
    {
        var result = await _inner.Calendar(request.Filters ?? new ActivityListFilters(), request.StartDate, request.EndDate, cancellationToken);
        return result;
    }
}
