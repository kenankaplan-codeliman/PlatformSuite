using CodePro.Application.Features.Suppliers.Dtos;
using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Suppliers;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Suppliers.Commands.CreateSupplier;

public sealed class CreateSupplierHandler : IRequestHandler<CreateSupplierCommand, Result<SupplierDetailItem>>
{
    private readonly ISupplierRepository _repository;
    private readonly ICodeProDbContext _db;

    public CreateSupplierHandler(ISupplierRepository repository, ICodeProDbContext db)
    {
        _repository = repository;
        _db = db;
    }

    public async Task<Result<SupplierDetailItem>> Handle(CreateSupplierCommand request, CancellationToken cancellationToken)
    {
        if (!string.IsNullOrWhiteSpace(request.Vkn))
        {
            var duplicate = await _db.Supplier.AsNoTracking()
                .AnyAsync(s => s.Vkn == request.Vkn, cancellationToken);
            if (duplicate) return SupplierErrors.DuplicateVkn;
        }

        var entity = request.Adapt<Supplier>();
        await _repository.CreateAsync(entity, cancellationToken);
        return entity.Adapt<SupplierDetailItem>();
    }
}
