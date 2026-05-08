using CodePro.Application.Features.Suppliers.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Suppliers.Commands.UpdateSupplier;

public sealed class UpdateSupplierHandler : IRequestHandler<UpdateSupplierCommand, Result<SupplierDetailItem>>
{
    private readonly ISupplierRepository _repository;
    private readonly ICodeProDbContext _db;

    public UpdateSupplierHandler(ISupplierRepository repository, ICodeProDbContext db)
    {
        _repository = repository;
        _db = db;
    }

    public async Task<Result<SupplierDetailItem>> Handle(UpdateSupplierCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return SupplierErrors.NotFound;

        if (!string.IsNullOrWhiteSpace(request.Vkn) && request.Vkn != entity.Vkn)
        {
            var duplicate = await _db.Supplier.AsNoTracking()
                .AnyAsync(s => s.Vkn == request.Vkn && s.Id != request.Id, cancellationToken);
            if (duplicate) return SupplierErrors.DuplicateVkn;
        }

        request.Adapt(entity);
        await _repository.UpdateAsync(entity, cancellationToken);
        return entity.Adapt<SupplierDetailItem>();
    }
}
