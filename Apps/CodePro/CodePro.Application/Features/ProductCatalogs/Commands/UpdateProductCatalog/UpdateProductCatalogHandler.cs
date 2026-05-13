using CodePro.Application.Features.ProductCatalogs.Dtos;
using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Products;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.ProductCatalogs.Commands.UpdateProductCatalog;

public sealed class UpdateProductCatalogHandler : IRequestHandler<UpdateProductCatalogCommand, Result<ProductCatalogDetailItem>>
{
    private readonly IProductCatalogRepository _repository;
    private readonly IAttachmentRepository _attachmentRepository;
    private readonly ICodeProDbContext _db;

    public UpdateProductCatalogHandler(
        IProductCatalogRepository repository,
        IAttachmentRepository attachmentRepository,
        ICodeProDbContext db)
    {
        _repository = repository;
        _attachmentRepository = attachmentRepository;
        _db = db;
    }

    public async Task<Result<ProductCatalogDetailItem>> Handle(UpdateProductCatalogCommand request, CancellationToken cancellationToken)
    {
        if (request.ValidUntil < request.ValidFrom)
            return ProductCatalogErrors.InvalidValidityRange;

        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return ProductCatalogErrors.NotFound;

        var codeExists = await _db.ProductCatalog.AsNoTracking()
            .AnyAsync(c => c.Id != request.Id && c.Code.ToLower() == request.Code.ToLower(), cancellationToken);
        if (codeExists) return ProductCatalogErrors.DuplicateCode;

        entity.Code = request.Code;
        entity.Name = request.Name;
        entity.Description = request.Description;
        entity.ValidFrom = request.ValidFrom;
        entity.ValidUntil = request.ValidUntil;
        entity.PriceCode = request.PriceCode;
        await _repository.UpdateAsync(entity, cancellationToken);

        await ProductCatalogSyncHelper.SyncProductsAsync(_db, entity.Id, request.ProductIds, cancellationToken);
        await ProductCatalogSyncHelper.SyncOrganizationsAsync(_db, entity.Id, request.OrganizationIds, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        if (request.Attachments.Count > 0)
        {
            var metadataIds = request.Attachments.Select(a => a.MetadataId).ToList();
            await _attachmentRepository.AssociateAsync(metadataIds, entity.Id, nameof(ProductCatalog), cancellationToken);
        }

        var detail = await ProductCatalogDetailBuilder.BuildAsync(_db, entity.Id, cancellationToken);
        if (detail is null) return ProductCatalogErrors.NotFound;
        return detail;
    }
}
