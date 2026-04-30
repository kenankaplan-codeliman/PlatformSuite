using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Results;
using Platform.Application.Features.AppUsers.Dtos;
using MediatR;

namespace Platform.Application.Features.AppUsers.Queries.GetAppUser;

public sealed class GetAppUserHandler : IRequestHandler<GetAppUserQuery, Result<AppUserDetailItem>>
{
    private readonly IApplicationDbContext _db;

    public GetAppUserHandler(IApplicationDbContext db) => _db = db;

    public async Task<Result<AppUserDetailItem>> Handle(GetAppUserQuery request, CancellationToken cancellationToken)
    {
        var detail = await AppUserDetailBuilder.BuildAsync(_db, request.Id, cancellationToken);
        if (detail is null) return AppUserErrors.NotFound;
        return detail;
    }
}
