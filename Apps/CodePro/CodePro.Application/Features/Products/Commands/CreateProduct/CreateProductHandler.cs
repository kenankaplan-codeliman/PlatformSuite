using CodePro.Application.Features.Products.Dtos;
using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Products;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Products.Commands.CreateProduct;

public sealed class CreateProductHandler : IRequestHandler<CreateProductCommand, Result<ProductDetailItem>>
{
    private readonly IProductRepository _repository;
    private readonly ICodeProDbContext _db;

    public CreateProductHandler(IProductRepository repository, ICodeProDbContext db)
    {
        _repository = repository;
        _db = db;
    }

    public async Task<Result<ProductDetailItem>> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        if (request.ValidUntil < request.ValidFrom)
            return ProductErrors.InvalidValidityRange;

        var codeExists = await _db.Product.AsNoTracking()
            .AnyAsync(p => p.Code.ToLower() == request.Code.ToLower(), cancellationToken);
        if (codeExists) return ProductErrors.DuplicateCode;

        var categoryId = request.ProductCategory?.Id ?? Guid.Empty;
        var categoryExists = await _db.ProductCategory.AsNoTracking()
            .AnyAsync(c => c.Id == categoryId, cancellationToken);
        if (!categoryExists) return ProductErrors.CategoryNotFound;

        var entity = request.Adapt<Product>();
        await _repository.CreateAsync(entity, cancellationToken);

        await SyncRelationsAsync(entity.Id, request, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        var detail = await ProductDetailBuilder.BuildAsync(_db, entity.Id, cancellationToken);
        if (detail is null) return ProductErrors.NotFound;
        return detail;
    }

    private async Task SyncRelationsAsync(Guid productId, CreateProductCommand request, CancellationToken cancellationToken)
    {
        await ProductSyncHelper.SyncBrandsAsync(_db, productId, request.BrandIds, cancellationToken);
        await ProductSyncHelper.SyncManufacturersAsync(_db, productId, request.ManufacturerIds, cancellationToken);
        await ProductSyncHelper.SyncKeywordsAsync(_db, productId, request.Keywords, cancellationToken);
        await ProductSyncHelper.SyncSupplierSkusAsync(_db, productId,
            request.SupplierSkus
                .Where(s => s.Supplier != null)
                .Select(s => new ProductSkuInput { SupplierId = s.Supplier!.Id, Sku = s.Sku })
                .ToList(),
            cancellationToken);
    }
}
