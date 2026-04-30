using CodePro.Application.Features.BudgetCategories.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.BudgetCategories.Queries.GetBudgetCategory;

public sealed class GetBudgetCategoryHandler : IRequestHandler<GetBudgetCategoryQuery, Result<BudgetCategoryDetailItem>>
{
    private readonly ICodeProDbContext _db;

    public GetBudgetCategoryHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<BudgetCategoryDetailItem>> Handle(GetBudgetCategoryQuery request, CancellationToken cancellationToken)
    {
        var entity = await _db.BudgetCategory
            .AsNoTracking()
            .Include(c => c.ParentCategory)
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

        if (entity is null) return BudgetCategoryErrors.NotFound;

        return entity.Adapt<BudgetCategoryDetailItem>();
    }
}
