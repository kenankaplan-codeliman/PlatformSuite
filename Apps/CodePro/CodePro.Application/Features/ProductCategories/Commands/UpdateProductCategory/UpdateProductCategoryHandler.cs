using CodePro.Application.Features.ProductCategories.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.ProductCategories.Commands.UpdateProductCategory;

public sealed class UpdateProductCategoryHandler : IRequestHandler<UpdateProductCategoryCommand, Result<ProductCategoryDetailItem>>
{
    private readonly IProductCategoryRepository _repository;
    private readonly ICodeProDbContext _db;

    public UpdateProductCategoryHandler(IProductCategoryRepository repository, ICodeProDbContext db)
    {
        _repository = repository;
        _db = db;
    }

    public async Task<Result<ProductCategoryDetailItem>> Handle(UpdateProductCategoryCommand request, CancellationToken cancellationToken)
    {
        if (request.ParentCategoryId == request.Id)
            return ProductCategoryErrors.CircularParent;

        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return ProductCategoryErrors.NotFound;

        // Aynı parent altında ad çakışması
        var nameExists = await _db.ProductCategory
            .AsNoTracking()
            .AnyAsync(
                c => c.Id != request.Id
                  && c.ParentCategoryId == request.ParentCategoryId
                  && c.Name.ToLower() == request.Name.ToLower(),
                cancellationToken);

        if (nameExists) return ProductCategoryErrors.DuplicateName;

        if (request.ParentCategoryId.HasValue)
        {
            var parentExists = await _db.ProductCategory
                .AsNoTracking()
                .AnyAsync(c => c.Id == request.ParentCategoryId.Value, cancellationToken);
            if (!parentExists) return ProductCategoryErrors.ParentNotFound;
        }

        request.Adapt(entity);
        entity.Title = await ComputeHierarchicalTitleAsync(request.Name, request.ParentCategoryId, cancellationToken);

        await _repository.UpdateAsync(entity, cancellationToken);

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
