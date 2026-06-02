using Platform.Application.Common.Parameters;
using Platform.Application.Common.Results;
using Crm.Application.Interfaces;
using Crm.Application.Features.Products.Dtos;
using Crm.Domain.Parameters;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Features.Products.Commands.UpdateProduct;

public sealed class UpdateProductHandler : IRequestHandler<UpdateProductCommand, Result<ProductDetailItem>>
{
    private readonly IProductRepository _repository;
    private readonly ICrmDbContext _db;
    private readonly IGeneralParameterReader _parameters;

    public UpdateProductHandler(
        IProductRepository repository,
        ICrmDbContext db,
        IGeneralParameterReader parameters)
    {
        _repository = repository;
        _db = db;
        _parameters = parameters;
    }

    public async Task<Result<ProductDetailItem>> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        if (!string.IsNullOrEmpty(request.Category) &&
            !await _parameters.ExistsAsync(ProductParameterCodes.Category, request.Category, cancellationToken))
            return ProductErrors.InvalidCategory;

        if (!string.IsNullOrEmpty(request.UnitOfMeasure) &&
            !await _parameters.ExistsAsync(ProductParameterCodes.UnitOfMeasure, request.UnitOfMeasure, cancellationToken))
            return ProductErrors.InvalidUnitOfMeasure;

        if (!string.IsNullOrEmpty(request.UnitPriceCurrency) &&
            !await _parameters.ExistsAsync(CurrencyParameterCodes.CurrencyType, request.UnitPriceCurrency, cancellationToken))
            return ProductErrors.InvalidCurrency;

        if (await _db.Product.AnyAsync(
                p => p.ProductCode == request.ProductCode && p.Id != request.Id && !p.IsDeleted, cancellationToken))
            return ProductErrors.DuplicateCode;

        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return ProductErrors.NotFound;

        request.Adapt(entity);
        await _repository.UpdateAsync(entity, cancellationToken);

        return await BuildDetailAsync(entity.Id, cancellationToken);
    }

    private async Task<ProductDetailItem> BuildDetailAsync(Guid id, CancellationToken cancellationToken)
    {
        var saved = await _db.Product.AsNoTracking().FirstAsync(p => p.Id == id, cancellationToken);
        return saved.Adapt<ProductDetailItem>();
    }
}
