using CodePro.Application.Features.BudgetCategories.Dtos;
using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Budgets;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.BudgetCategories.Commands.CreateBudgetCategory;

public sealed class CreateBudgetCategoryHandler : IRequestHandler<CreateBudgetCategoryCommand, Result<BudgetCategoryDetailItem>>
{
    private readonly IBudgetCategoryRepository _repository;
    private readonly ICodeProDbContext _db;

    public CreateBudgetCategoryHandler(IBudgetCategoryRepository repository, ICodeProDbContext db)
    {
        _repository = repository;
        _db = db;
    }

    public async Task<Result<BudgetCategoryDetailItem>> Handle(CreateBudgetCategoryCommand request, CancellationToken cancellationToken)
    {
        var nameExists = await _db.BudgetCategory
            .AsNoTracking()
            .AnyAsync(
                c => c.ParentCategoryId == request.ParentCategoryId
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

        var entity = request.Adapt<BudgetCategory>();
        await _repository.CreateAsync(entity, cancellationToken);

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
