using CodePro.Application.Features.Manufacturers.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Manufacturers.Queries.GetManufacturer;

public sealed class GetManufacturerHandler : IRequestHandler<GetManufacturerQuery, Result<ManufacturerDetailItem>>
{
    private readonly ICodeProDbContext _db;

    public GetManufacturerHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<ManufacturerDetailItem>> Handle(GetManufacturerQuery request, CancellationToken cancellationToken)
    {
        var entity = await _db.Manufacturer
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.Id == request.Id, cancellationToken);

        if (entity is null) return ManufacturerErrors.NotFound;

        return entity.Adapt<ManufacturerDetailItem>();
    }
}
