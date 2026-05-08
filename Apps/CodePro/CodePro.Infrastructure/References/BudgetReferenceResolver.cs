using CodePro.Domain.Entities.Budgets;
using CodePro.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Platform.Application.Common.References;
using Platform.Application.Exceptions;
using Platform.Application.Modals.Common;

namespace CodePro.Infrastructure.References;

public class BudgetReferenceResolver : IEntityReferenceResolver
{
    private readonly CodeProDbContext dbContext;
    private readonly IConfiguration configuration;

    public BudgetReferenceResolver(CodeProDbContext dbContext, IConfiguration configuration)
    {
        this.dbContext = dbContext;
        this.configuration = configuration;
    }

    public string EntityType => nameof(Budget);

    public EntityReference GetReference(Guid id)
    {
        var budget = dbContext.Budget
            .Select(b => new { b.Id, b.Name })
            .FirstOrDefault(b => b.Id == id) ?? throw new NotFoundException();

        return new EntityReference(nameof(Budget))
        {
            Id = budget.Id,
            Name = budget.Name,
        };
    }

    public EntityReferenceList LookupReference(string? searchText, PaginationInfo paginationInfo)
    {
        int pageSize = int.Parse(configuration["DefaultValues:Search_Max_Record"]!);
        int skipCnt = 0;

        if (paginationInfo != null && paginationInfo.isValid())
        {
            pageSize = paginationInfo.PageSize;
            var pageIndex = (paginationInfo.Page - 1) >= 0 ? paginationInfo.Page - 1 : 0;
            skipCnt = pageIndex * paginationInfo.PageSize;
        }

        var tempQuery = dbContext.Budget.AsNoTracking();

        if (!string.IsNullOrEmpty(searchText))
        {
            tempQuery = tempQuery.Where(b => EF.Functions.ILike(b.Name, $"%{searchText}%"));
        }

        var entityList = tempQuery
            .Select(b => new { b.Id, b.Name })
            .Skip(skipCnt).Take(pageSize + 1).ToList();

        var hasMore = entityList.Count > pageSize;

        var result = entityList.Take(pageSize)
            .Select(b => new EntityReference(nameof(Budget))
            {
                Id = b.Id,
                Name = b.Name,
            })
            .ToList();

        return new EntityReferenceList
        {
            Data = result,
            HasMore = hasMore,
            Page = paginationInfo?.Page ?? 1,
            PageSize = pageSize,
        };
    }
}
