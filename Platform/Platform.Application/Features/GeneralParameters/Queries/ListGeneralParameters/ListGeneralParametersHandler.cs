using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Results;
using Platform.Application.Features.GeneralParameters.Dtos;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Platform.Application.Features.GeneralParameters.Queries.ListGeneralParameters;

public sealed class ListGeneralParametersHandler
    : IRequestHandler<ListGeneralParametersQuery, Result<IReadOnlyList<GeneralParameterListItem>>>
{
    private readonly IApplicationDbContext _db;

    public ListGeneralParametersHandler(IApplicationDbContext db) => _db = db;

    public async Task<Result<IReadOnlyList<GeneralParameterListItem>>> Handle(
        ListGeneralParametersQuery request, CancellationToken cancellationToken)
    {
        var query = _db.GeneralParameter.AsNoTracking().Where(p => p.IsActive);

        if (!string.IsNullOrWhiteSpace(request.ParentCode))
            query = query.Where(p => p.ParentCode == request.ParentCode);

        var items = await query
            .OrderBy(p => p.ParentCode)
            .ThenBy(p => p.OrderIndex)
            .ProjectToType<GeneralParameterListItem>()
            .ToListAsync(cancellationToken);

        return Result.Success<IReadOnlyList<GeneralParameterListItem>>(items);
    }
}
