using CodePro.Application.Features.Products.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Products.Commands.UpdateProduct;

public sealed class UpdateProductHandler : IRequestHandler<UpdateProductCommand, Result<ProductDetailItem>>
{
    private readonly IProductRepository _repository;
    private readonly ICodeProDbContext _db;

    public UpdateProductHandler(IProductRepository repository, ICodeProDbContext db)
    {
        _repository = repository;
        _db = db;
    }

    public async Task<Result<ProductDetailItem>> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        if (request.ValidUntil < request.ValidFrom)
            return ProductErrors.InvalidValidityRange;

        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return ProductErrors.NotFound;

        var codeExists = await _db.Product.AsNoTracking()
            .AnyAsync(p => p.Id != request.Id && p.Code.ToLower() == request.Code.ToLower(), cancellationToken);
        if (codeExists) return ProductErrors.DuplicateCode;

        var categoryId = request.ProductCategory?.Id ?? Guid.Empty;
        var categoryExists = await _db.ProductCategory.AsNoTracking()
            .AnyAsync(c => c.Id == categoryId, cancellationToken);
        if (!categoryExists) return ProductErrors.CategoryNotFound;

        entity.Code = request.Code;
        entity.Name = request.Name;
        entity.ShortDescription = request.ShortDescription;
        entity.DetailedDescription = request.DetailedDescription;
        entity.ValidFrom = request.ValidFrom;
        entity.ValidUntil = request.ValidUntil;
        entity.UnitOfMeasure = request.UnitOfMeasure;
        entity.ManufacturerPartNumber = request.ManufacturerPartNumber;
        entity.Model = request.Model;
        entity.Color = request.Color;
        entity.ProductUrl = request.ProductUrl;
        entity.QuantityPerUnit = request.QuantityPerUnit;
        entity.DeliveryDays = request.DeliveryDays;
        entity.AccountCodeId = request.AccountCodeId;
        entity.ProductCategoryId = categoryId;

        await _repository.UpdateAsync(entity, cancellationToken);

        await ProductSyncHelper.SyncBrandsAsync(_db, entity.Id, request.BrandIds, cancellationToken);
        await ProductSyncHelper.SyncManufacturersAsync(_db, entity.Id, request.ManufacturerIds, cancellationToken);
        await ProductSyncHelper.SyncKeywordsAsync(_db, entity.Id, request.Keywords, cancellationToken);
        await ProductSyncHelper.SyncSupplierSkusAsync(_db, entity.Id,
            request.SupplierSkus
                .Where(s => s.SupplierAccount != null)
                .Select(s => new ProductSkuInput { SupplierAccountId = s.SupplierAccount!.Id, Sku = s.Sku })
                .ToList(),
            cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        var detail = await ProductDetailBuilder.BuildAsync(_db, entity.Id, cancellationToken);
        if (detail is null) return ProductErrors.NotFound;
        return detail;
    }
}
