using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Results;
using Platform.Application.Features.AppRoles.Dtos;
using MediatR;

namespace Platform.Application.Features.AppRoles.Queries.GetAppRole;

public sealed class GetAppRoleHandler : IRequestHandler<GetAppRoleQuery, Result<AppRoleDetailItem>>
{
    private readonly IApplicationDbContext _db;

    public GetAppRoleHandler(IApplicationDbContext db) => _db = db;

    public async Task<Result<AppRoleDetailItem>> Handle(GetAppRoleQuery request, CancellationToken cancellationToken)
    {
        var detail = await AppRoleDetailBuilder.BuildAsync(_db, request.Id, cancellationToken);
        if (detail is null) return AppRoleErrors.NotFound;
        return detail;
    }
}
