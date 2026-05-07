using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Results;
using Platform.Application.Features.AppOrganizations.Dtos;
using MediatR;

namespace Platform.Application.Features.AppOrganizations.Queries.GetAppOrganization;

public sealed class GetAppOrganizationHandler : IRequestHandler<GetAppOrganizationQuery, Result<AppOrganizationDetailItem>>
{
    private readonly IApplicationDbContext _db;

    public GetAppOrganizationHandler(IApplicationDbContext db) => _db = db;

    public async Task<Result<AppOrganizationDetailItem>> Handle(GetAppOrganizationQuery request, CancellationToken cancellationToken)
    {
        var dto = await AppOrganizationDetailBuilder.BuildAsync(_db, request.Id, cancellationToken);
        if (dto is null) return AppOrganizationErrors.NotFound;
        return dto;
    }
}
