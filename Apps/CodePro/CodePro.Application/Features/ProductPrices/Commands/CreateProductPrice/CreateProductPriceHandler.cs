using CodePro.Application.Features.ProductPrices.Dtos;
using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Products;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.ProductPrices.Commands.CreateProductPrice;

public sealed class CreateProductPriceHandler : IRequestHandler<CreateProductPriceCommand, Result<ProductPriceDetailItem>>
{
    private readonly IProductPriceRepository _repository;
    private readonly ICodeProDbContext _db;

    public CreateProductPriceHandler(IProductPriceRepository repository, ICodeProDbContext db)
    {
        _repository = repository;
        _db = db;
    }

    public async Task<Result<ProductPriceDetailItem>> Handle(CreateProductPriceCommand request, CancellationToken cancellationToken)
    {
        if (request.ValidUntil < request.ValidFrom)
            return ProductPriceErrors.InvalidValidityRange;

        if (request.UnitPrice <= 0)
            return ProductPriceErrors.InvalidPrice;

        var productId = request.Product?.Id ?? Guid.Empty;
        var productExists = await _db.Product.AsNoTracking()
            .AnyAsync(p => p.Id == productId, cancellationToken);
        if (!productExists) return ProductPriceErrors.ProductNotFound;

        var supplierId = request.Supplier?.Id ?? Guid.Empty;
        var supplierExists = await _db.Supplier.AsNoTracking()
            .AnyAsync(a => a.Id == supplierId, cancellationToken);
        if (!supplierExists) return ProductPriceErrors.SupplierNotFound;

        if (request.PriceList != null)
        {
            var priceListId = request.PriceList.Id;
            var priceListExists = await _db.PriceList.AsNoTracking()
                .AnyAsync(pl => pl.Id == priceListId, cancellationToken);
            if (!priceListExists) return ProductPriceErrors.PriceListNotFound;
        }

        var entity = request.Adapt<ProductPrice>();
        await _repository.CreateAsync(entity, cancellationToken);

        return await BuildDetailAsync(entity.Id, cancellationToken);
    }

    private async Task<ProductPriceDetailItem> BuildDetailAsync(Guid id, CancellationToken cancellationToken)
    {
        var entity = await _db.ProductPrice.AsNoTracking()
            .Include(p => p.Product)
            .Include(p => p.Supplier)
            .Include(p => p.PriceList)
            .FirstAsync(p => p.Id == id, cancellationToken);
        return entity.Adapt<ProductPriceDetailItem>();
    }
}
