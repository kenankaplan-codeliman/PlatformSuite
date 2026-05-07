using CodePro.Application.Features.PriceLists.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.PriceLists.Commands.UpdatePriceList;

public sealed class UpdatePriceListHandler : IRequestHandler<UpdatePriceListCommand, Result<PriceListDetailItem>>
{
    private readonly IPriceListRepository _repository;
    private readonly ICodeProDbContext _db;

    public UpdatePriceListHandler(IPriceListRepository repository, ICodeProDbContext db)
    {
        _repository = repository;
        _db = db;
    }

    public async Task<Result<PriceListDetailItem>> Handle(UpdatePriceListCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return PriceListErrors.NotFound;

        var supplierId = request.SupplierAccount?.Id ?? Guid.Empty;
        var supplierExists = await _db.Account.AsNoTracking()
            .AnyAsync(a => a.Id == supplierId, cancellationToken);
        if (!supplierExists) return PriceListErrors.SupplierNotFound;

        var codeExists = await _db.PriceList.AsNoTracking()
            .AnyAsync(p => p.Id != request.Id && p.Code.ToLower() == request.Code.ToLower(), cancellationToken);
        if (codeExists) return PriceListErrors.DuplicateCode;

        entity.Code = request.Code;
        entity.Name = request.Name;
        entity.Description = request.Description;
        entity.SupplierAccountId = supplierId;

        await _repository.UpdateAsync(entity, cancellationToken);

        var saved = await _db.PriceList.AsNoTracking()
            .Include(p => p.SupplierAccount)
            .FirstAsync(p => p.Id == entity.Id, cancellationToken);
        return saved.Adapt<PriceListDetailItem>();
    }
}
