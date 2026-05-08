using CodePro.Application.Features.Budgets.Dtos;
using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Budgets;
using CodePro.Domain.Enums;
using Platform.Application.Common.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Budgets.Commands.CreateBudget;

public sealed class CreateBudgetHandler : IRequestHandler<CreateBudgetCommand, Result<BudgetDetailItem>>
{
    private readonly IBudgetRepository _repository;
    private readonly ICodeProDbContext _db;

    public CreateBudgetHandler(IBudgetRepository repository, ICodeProDbContext db)
    {
        _repository = repository;
        _db = db;
    }

    public async Task<Result<BudgetDetailItem>> Handle(CreateBudgetCommand request, CancellationToken cancellationToken)
    {
        if (request.EndDate < request.StartDate) return BudgetErrors.InvalidDateRange;
        if (request.TotalAmount < 0) return BudgetErrors.InvalidTotalAmount;

        var entity = new Budget
        {
            Name = request.Name,
            Description = request.Description,
            ScopeOrganizationId = request.ScopeOrganizationId,
            BudgetCategoryId = request.BudgetCategoryId,
            PeriodType = request.PeriodType,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            TotalAmount = request.TotalAmount,
            Currency = request.Currency,
            OverflowBehavior = request.OverflowBehavior,
            ReservationReleasePoint = request.ReservationReleasePoint,
            AlertThresholdPercentage = request.AlertThresholdPercentage,
            CarryOverEnabled = request.CarryOverEnabled,
            ResponsibleUserId = request.ResponsibleUserId,
            Status = BudgetStatus.Active,
        };
        await _repository.CreateAsync(entity, cancellationToken);

        return await BuildDetailAsync(entity.Id, cancellationToken);
    }

    private async Task<BudgetDetailItem> BuildDetailAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _db.Budget.AsNoTracking()
            .Where(b => b.Id == id)
            .Select(b => new BudgetDetailItem
            {
                Id = b.Id,
                Name = b.Name,
                Description = b.Description,
                ScopeOrganizationId = b.ScopeOrganizationId,
                ScopeOrganizationName = b.ScopeOrganizationId.HasValue
                    ? _db.Organization.Where(o => o.Id == b.ScopeOrganizationId).Select(o => o.OrganizationName).FirstOrDefault()
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
    }
}
