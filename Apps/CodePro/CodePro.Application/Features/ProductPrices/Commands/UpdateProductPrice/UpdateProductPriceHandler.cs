using CodePro.Application.Features.ProductPrices.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.ProductPrices.Commands.UpdateProductPrice;

public sealed class UpdateProductPriceHandler : IRequestHandler<UpdateProductPriceCommand, Result<ProductPriceDetailItem>>
{
    private readonly IProductPriceRepository _repository;
    private readonly ICodeProDbContext _db;

    public UpdateProductPriceHandler(IProductPriceRepository repository, ICodeProDbContext db)
    {
        _repository = repository;
        _db = db;
    }

    public async Task<Result<ProductPriceDetailItem>> Handle(UpdateProductPriceCommand request, CancellationToken cancellationToken)
    {
        if (request.ValidUntil < request.ValidFrom)
            return ProductPriceErrors.InvalidValidityRange;

        if (request.UnitPrice <= 0)
            return ProductPriceErrors.InvalidPrice;

        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return ProductPriceErrors.NotFound;

        var productExists = await _db.Product.AsNoTracking()
            .AnyAsync(p => p.Id == request.ProductId, cancellationToken);
        if (!productExists) return ProductPriceErrors.ProductNotFound;

        var supplierExists = await _db.Account.AsNoTracking()
            .AnyAsync(a => a.Id == request.SupplierAccountId, cancellationToken);
        if (!supplierExists) return ProductPriceErrors.SupplierNotFound;

        if (request.PriceListId.HasValue)
        {
            var priceListExists = await _db.PriceList.AsNoTracking()
                .AnyAsync(pl => pl.Id == request.PriceListId.Value, cancellationToken);
            if (!priceListExists) return ProductPriceErrors.PriceListNotFound;
        }

        entity.ProductId = request.ProductId;
        entity.SupplierAccountId = request.SupplierAccountId;
        entity.PriceListId = request.PriceListId;
        entity.MinimumQuantity = request.MinimumQuantity;
        entity.ValidFrom = request.ValidFrom;
        entity.ValidUntil = request.ValidUntil;
        entity.UnitPrice = request.UnitPrice;
        entity.Currency = request.Currency;

        await _repository.UpdateAsync(entity, cancellationToken);

        var saved = await _db.ProductPrice.AsNoTracking()
            .Include(p => p.Product)
            .Include(p => p.SupplierAccount)
            .Include(p => p.PriceList)
            .FirstAsync(p => p.Id == entity.Id, cancellationToken);
        return saved.Adapt<ProductPriceDetailItem>();
    }
}
