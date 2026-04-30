using CodePro.Application.Features.Budgets.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Budgets.Commands.UpdateBudget;

public sealed class UpdateBudgetHandler : IRequestHandler<UpdateBudgetCommand, Result<BudgetDetailItem>>
{
    private readonly IBudgetRepository _repository;
    private readonly ICodeProDbContext _db;

    public UpdateBudgetHandler(IBudgetRepository repository, ICodeProDbContext db)
    {
        _repository = repository;
        _db = db;
    }

    public async Task<Result<BudgetDetailItem>> Handle(UpdateBudgetCommand request, CancellationToken cancellationToken)
    {
        if (request.EndDate < request.StartDate) return BudgetErrors.InvalidDateRange;
        if (request.TotalAmount < 0) return BudgetErrors.InvalidTotalAmount;

        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return BudgetErrors.NotFound;

        entity.Name = request.Name;
        entity.Description = request.Description;
        entity.ScopeOrganizationId = request.ScopeOrganizationId;
        entity.BudgetCategoryId = request.BudgetCategoryId;
        entity.PeriodType = request.PeriodType;
        entity.StartDate = request.StartDate;
        entity.EndDate = request.EndDate;
        entity.TotalAmount = request.TotalAmount;
        entity.Currency = request.Currency;
        entity.OverflowBehavior = request.OverflowBehavior;
        entity.ReservationReleasePoint = request.ReservationReleasePoint;
        entity.AlertThresholdPercentage = request.AlertThresholdPercentage;
        entity.CarryOverEnabled = request.CarryOverEnabled;
        entity.ResponsibleUserId = request.ResponsibleUserId;
        entity.Status = request.Status;

        await _repository.UpdateAsync(entity, cancellationToken);

        var result = await _db.Budget.AsNoTracking()
            .Where(b => b.Id == entity.Id)
            .Select(b => new BudgetDetailItem
            {
                Id = b.Id,
                Name = b.Name,
                Description = b.Description,
                ScopeOrganizationId = b.ScopeOrganizationId,
                ScopeOrganizationName = b.ScopeOrganizationId.HasValue
                    ? _db.AppOrganization.Where(o => o.Id == b.ScopeOrganizationId).Select(o => o.OrganizationName).FirstOrDefault()
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
            .FirstAsync(cancellationToken);

        return result;
    }
}
