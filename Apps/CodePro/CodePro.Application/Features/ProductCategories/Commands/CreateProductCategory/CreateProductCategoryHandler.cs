using CodePro.Application.Features.ProductCategories.Dtos;
using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Products;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.ProductCategories.Commands.CreateProductCategory;

public sealed class CreateProductCategoryHandler : IRequestHandler<CreateProductCategoryCommand, Result<ProductCategoryDetailItem>>
{
    private readonly IProductCategoryRepository _repository;
    private readonly IAttachmentRepository _attachmentRepository;
    private readonly ICodeProDbContext _db;

    public CreateProductCategoryHandler(
        IProductCategoryRepository repository,
        IAttachmentRepository attachmentRepository,
        ICodeProDbContext db)
    {
        _repository = repository;
        _attachmentRepository = attachmentRepository;
        _db = db;
    }

    public async Task<Result<ProductCategoryDetailItem>> Handle(CreateProductCategoryCommand request, CancellationToken cancellationToken)
    {
        // Aynı parent altında aynı isim çakışması
        var nameExists = await _db.ProductCategory
            .AsNoTracking()
            .AnyAsync(
                c => c.ParentCategoryId == request.ParentCategoryId
                  && c.Name.ToLower() == request.Name.ToLower(),
                cancellationToken);

        if (nameExists) return ProductCategoryErrors.DuplicateName;

        // Parent doğrulama
        if (request.ParentCategoryId.HasValue)
        {
            var parentExists = await _db.ProductCategory
                .AsNoTracking()
                .AnyAsync(c => c.Id == request.ParentCategoryId.Value, cancellationToken);
            if (!parentExists) return ProductCategoryErrors.ParentNotFound;
        }

        var entity = request.Adapt<ProductCategory>();
        entity.Title = await ComputeHierarchicalTitleAsync(request.Name, request.ParentCategoryId, cancellationToken);

        await _repository.CreateAsync(entity, cancellationToken);

        if (request.Attachments.Count > 0)
        {
            var metadataIds = request.Attachments.Select(a => a.MetadataId).ToList();
            await _attachmentRepository.AssociateAsync(metadataIds, entity.Id, nameof(ProductCategory), cancellationToken);
        }

        // Detail için ParentCategoryName'i de yükle
        var dto = entity.Adapt<ProductCategoryDetailItem>();
        if (request.ParentCategoryId.HasValue)
        {
            dto.ParentCategoryName = await _db.ProductCategory.AsNoTracking()
                .Where(c => c.Id == request.ParentCategoryId.Value)
                .Select(c => c.Name)
                .FirstOrDefaultAsync(cancellationToken);
        }
        return dto;
    }

    private async Task<string> ComputeHierarchicalTitleAsync(string name, Guid? parentId, CancellationToken cancellationToken)
    {
        if (!parentId.HasValue) return name;

        var parent = await _db.ProductCategory.AsNoTracking()
            .Where(c => c.Id == parentId.Value)
            .Select(c => new { c.Title, c.Name })
            .FirstOrDefaultAsync(cancellationToken);

        if (parent is null) return name;
        var parentTitle = string.IsNullOrWhiteSpace(parent.Title) ? parent.Name : parent.Title;
        return $"{parentTitle} \\ {name}";
    }
}
