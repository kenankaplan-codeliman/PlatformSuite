using CodePro.Application.Features.Budgets.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Budgets.Queries.GetBudget;

public sealed class GetBudgetHandler : IRequestHandler<GetBudgetQuery, Result<BudgetDetailItem>>
{
    private readonly ICodeProDbContext _db;

    public GetBudgetHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<BudgetDetailItem>> Handle(GetBudgetQuery request, CancellationToken cancellationToken)
    {
        var detail = await _db.Budget.AsNoTracking()
            .Where(b => b.Id == request.Id)
            .Select(b => new BudgetDetailItem
            {
                Id = b.Id,
                Name = b.Name,
                Description = b.Description,
                ScopeOrganizationId = b.ScopeOrganizationId,
                ScopeOrganizationName = b.ScopeOrganizationId.HasValue
                    ? _db.AuthOrganization.Where(o => o.Id == b.ScopeOrganizationId).Select(o => o.OrganizationName).FirstOrDefault()
                    : null,
                BudgetCategoryId = b.BudgetCategoryId,
                BudgetCategoryName = b.BudgetCategoryId.HasValue
                    ? _db.BudgetCategory.Where(c => c.Id == b.BudgetCategoryId).Select(c => c.Name).FirstOrDefault()
                    : null,
                PeriodType = b.PeriodType,
                StartDate = b.StartDate,
                EndDate = b.EndDate,
                TotalAmount = b.TotalAmount,
                Currency = b.Currency,
                OverflowBehavior = b.OverflowBehavior,
                ReservationReleasePoint = b.ReservationReleasePoint,
                AlertThresholdPercentage = b.AlertThresholdPercentage,
                CarryOverEnabled = b.CarryOverEnabled,
                ResponsibleUserId = b.ResponsibleUserId,
                Status = b.Status,
                IsActive = b.IsActive,
                CreatedAt = b.CreatedAt,
                UpdatedAt = b.UpdatedAt,
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (detail is null) return BudgetErrors.NotFound;
        return detail;
    }
}
