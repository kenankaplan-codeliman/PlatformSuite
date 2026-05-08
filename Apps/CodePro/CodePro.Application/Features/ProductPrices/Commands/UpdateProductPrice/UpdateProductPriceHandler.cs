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

        var productId = request.Product?.Id ?? Guid.Empty;
        var productExists = await _db.Product.AsNoTracking()
            .AnyAsync(p => p.Id == productId, cancellationToken);
        if (!productExists) return ProductPriceErrors.ProductNotFound;

        var supplierId = request.Supplier?.Id ?? Guid.Empty;
        var supplierExists = await _db.Supplier.AsNoTracking()
            .AnyAsync(a => a.Id == supplierId, cancellationToken);
        if (!supplierExists) return ProductPriceErrors.SupplierNotFound;

        Guid? priceListId = request.PriceList?.Id;
        if (priceListId.HasValue)
        {
            var priceListExists = await _db.PriceList.AsNoTracking()
                .AnyAsync(pl => pl.Id == priceListId.Value, cancellationToken);
            if (!priceListExists) return ProductPriceErrors.PriceListNotFound;
        }

        entity.ProductId = productId;
        entity.SupplierId = supplierId;
        entity.PriceListId = priceListId;
        entity.MinimumQuantity = request.MinimumQuantity;
        entity.ValidFrom = request.ValidFrom;
        entity.ValidUntil = request.ValidUntil;
        entity.UnitPrice = request.UnitPrice;
        entity.Currency = request.Currency;

        await _repository.UpdateAsync(entity, cancellationToken);

        var saved = await _db.ProductPrice.AsNoTracking()
            .Include(p => p.Product)
            .Include(p => p.Supplier)
            .Include(p => p.PriceList)
            .FirstAsync(p => p.Id == entity.Id, cancellationToken);
        return saved.Adapt<ProductPriceDetailItem>();
    }
}
