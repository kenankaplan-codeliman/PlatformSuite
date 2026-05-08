using CodePro.Application.Features.Suppliers.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Suppliers.Queries.GetSupplier;

public sealed class GetSupplierHandler : IRequestHandler<GetSupplierQuery, Result<SupplierDetailItem>>
{
    private readonly ICodeProDbContext _db;

    public GetSupplierHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<SupplierDetailItem>> Handle(GetSupplierQuery request, CancellationToken cancellationToken)
    {
        var entity = await _db.Supplier.AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);

        if (entity is null) return SupplierErrors.NotFound;

        return entity.Adapt<SupplierDetailItem>();
    }
}
