using CodePro.Application.Features.Budgets.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Budgets.Queries.ListBudgets;

public sealed class ListBudgetsHandler : IRequestHandler<ListBudgetsQuery, Result<PagedResult<BudgetListItem>>>
{
    private readonly ICodeProDbContext _db;

    public ListBudgetsHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<PagedResult<BudgetListItem>>> Handle(ListBudgetsQuery request, CancellationToken cancellationToken)
    {
        var query = _db.Budget.AsNoTracking();
        var filters = request.Filters;

        if (!string.IsNullOrWhiteSpace(filters.Search))
        {
            var pattern = filters.Search.ToLower();
            query = query.Where(b => b.Name.ToLower().Contains(pattern));
        }

        if (filters.Status.HasValue)
            query = query.Where(b => b.Status == filters.Status.Value);

        if (filters.PeriodType.HasValue)
            query = query.Where(b => b.PeriodType == filters.PeriodType.Value);

        if (filters.BudgetCategoryId.HasValue)
            query = query.Where(b => b.BudgetCategoryId == filters.BudgetCategoryId.Value);

        if (filters.IsActive.HasValue)
            query = query.Where(b => b.IsActive == filters.IsActive.Value);

        var pageNumber = request.Pagination.PageNumber;
        var pageSize = request.Pagination.PageSize;
        var pageIndex = Math.Max(pageNumber - 1, 0);
        var skip = pageIndex * pageSize;

        var items = await query
            .OrderByDescending(b => b.StartDate)
            .Skip(skip)
            .Take(pageSize + 1)
            .Select(b => new BudgetListItem
            {
                Id = b.Id,
                Name = b.Name,
                PeriodType = b.PeriodType,
                Status = b.Status,
                StartDate = b.StartDate,
                EndDate = b.EndDate,
                TotalAmount = b.TotalAmount,
                Currency = b.Currency,
                BudgetCategoryName = b.BudgetCategoryId.HasValue
                    ? _db.BudgetCategory.Where(c => c.Id == b.BudgetCategoryId).Select(c => c.Name).FirstOrDefault()
                    : null,
                ScopeOrganizationName = b.ScopeOrganizationId.HasValue
                    ? _db.AppOrganization.Where(o => o.Id == b.ScopeOrganizationId).Select(o => o.OrganizationName).FirstOrDefault()
                    : null,
                IsActive = b.IsActive,
            })
            .ToListAsync(cancellationToken);

        var hasMore = items.Count > pageSize;
        if (hasMore) items.RemoveAt(items.Count - 1);

        return new PagedResult<BudgetListItem>
        {
            Data = items,
            Pagination = new PaginationResponse
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                HasMoreRecord = hasMore,
            },
        };
    }
}
