using CodePro.Application.Features.ProductCatalogs.Dtos;
using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Products;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.ProductCatalogs.Commands.CreateProductCatalog;

public sealed class CreateProductCatalogHandler : IRequestHandler<CreateProductCatalogCommand, Result<ProductCatalogDetailItem>>
{
    private readonly IProductCatalogRepository _repository;
    private readonly IAttachmentRepository _attachmentRepository;
    private readonly ICodeProDbContext _db;

    public CreateProductCatalogHandler(
        IProductCatalogRepository repository,
        IAttachmentRepository attachmentRepository,
        ICodeProDbContext db)
    {
        _repository = repository;
        _attachmentRepository = attachmentRepository;
        _db = db;
    }

    public async Task<Result<ProductCatalogDetailItem>> Handle(CreateProductCatalogCommand request, CancellationToken cancellationToken)
    {
        if (request.ValidUntil < request.ValidFrom)
            return ProductCatalogErrors.InvalidValidityRange;

        var codeExists = await _db.ProductCatalog.AsNoTracking()
            .AnyAsync(c => c.Code.ToLower() == request.Code.ToLower(), cancellationToken);
        if (codeExists) return ProductCatalogErrors.DuplicateCode;

        var entity = new ProductCatalog
        {
            Code = request.Code,
            Name = request.Name,
            Description = request.Description,
            ValidFrom = request.ValidFrom,
            ValidUntil = request.ValidUntil,
            PriceCode = request.PriceCode,
        };
        await _repository.CreateAsync(entity, cancellationToken);

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
