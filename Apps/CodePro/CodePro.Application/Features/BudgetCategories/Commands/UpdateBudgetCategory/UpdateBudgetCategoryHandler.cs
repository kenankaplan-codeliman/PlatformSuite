using CodePro.Application.Features.BudgetCategories.Dtos;
using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Budgets;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.BudgetCategories.Commands.UpdateBudgetCategory;

public sealed class UpdateBudgetCategoryHandler : IRequestHandler<UpdateBudgetCategoryCommand, Result<BudgetCategoryDetailItem>>
{
    private readonly IBudgetCategoryRepository _repository;
    private readonly IAttachmentRepository _attachmentRepository;
    private readonly ICodeProDbContext _db;

    public UpdateBudgetCategoryHandler(
        IBudgetCategoryRepository repository,
        IAttachmentRepository attachmentRepository,
        ICodeProDbContext db)
    {
        _repository = repository;
        _attachmentRepository = attachmentRepository;
        _db = db;
    }

    public async Task<Result<BudgetCategoryDetailItem>> Handle(UpdateBudgetCategoryCommand request, CancellationToken cancellationToken)
    {
        if (request.ParentCategoryId == request.Id)
            return BudgetCategoryErrors.CircularParent;

        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return BudgetCategoryErrors.NotFound;

        var nameExists = await _db.BudgetCategory
            .AsNoTracking()
            .AnyAsync(
                c => c.Id != request.Id
                  && c.ParentCategoryId == request.ParentCategoryId
                  && c.Name.ToLower() == request.Name.ToLower(),
                cancellationToken);

        if (nameExists) return BudgetCategoryErrors.DuplicateName;

        if (request.ParentCategoryId.HasValue)
        {
            var parentExists = await _db.BudgetCategory
                .AsNoTracking()
                .AnyAsync(c => c.Id == request.ParentCategoryId.Value, cancellationToken);
            if (!parentExists) return BudgetCategoryErrors.ParentNotFound;
        }

        request.Adapt(entity);
        await _repository.UpdateAsync(entity, cancellationToken);

        if (request.Attachments.Count > 0)
        {
            var metadataIds = request.Attachments.Select(a => a.MetadataId).ToList();
            await _attachmentRepository.AssociateAsync(metadataIds, entity.Id, nameof(BudgetCategory), cancellationToken);
        }

        var dto = entity.Adapt<BudgetCategoryDetailItem>();
        if (request.ParentCategoryId.HasValue)
        {
            dto.ParentCategoryName = await _db.BudgetCategory.AsNoTracking()
                .Where(c => c.Id == request.ParentCategoryId.Value)
                .Select(c => c.Name)
                .FirstOrDefaultAsync(cancellationToken);
        }
        return dto;
    }
}
