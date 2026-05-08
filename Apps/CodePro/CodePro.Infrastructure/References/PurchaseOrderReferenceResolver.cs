using CodePro.Domain.Entities.PurchaseOrders;
using CodePro.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Platform.Application.Common.References;
using Platform.Application.Exceptions;
using Platform.Application.Modals.Common;

namespace CodePro.Infrastructure.References;

public class PurchaseOrderReferenceResolver : IEntityReferenceResolver
{
    private readonly CodeProDbContext dbContext;
    private readonly IConfiguration configuration;

    public PurchaseOrderReferenceResolver(CodeProDbContext dbContext, IConfiguration configuration)
    {
        this.dbContext = dbContext;
        this.configuration = configuration;
    }

    public string EntityType => nameof(PurchaseOrder);

    public EntityReference GetReference(Guid id)
    {
        var po = dbContext.PurchaseOrder
            .Select(p => new { p.Id, p.OrderNumber, p.Title })
            .FirstOrDefault(p => p.Id == id) ?? throw new NotFoundException();

        return new EntityReference(nameof(PurchaseOrder))
        {
            Id = po.Id,
            Name = $"{po.OrderNumber} — {po.Title}",
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

        var tempQuery = dbContext.PurchaseOrder.AsNoTracking().Where(x => x.IsActive);

        if (!string.IsNullOrEmpty(searchText))
        {
            var pattern = $"%{searchText}%";
            tempQuery = tempQuery.Where(p =>
                EF.Functions.ILike(p.OrderNumber, pattern)
                || EF.Functions.ILike(p.Title, pattern));
        }

        var entityList = tempQuery
            .Select(p => new { p.Id, p.OrderNumber, p.Title })
            .Skip(skipCnt).Take(pageSize + 1).ToList();

        var hasMore = entityList.Count > pageSize;

        var result = entityList.Take(pageSize)
            .Select(p => new EntityReference(nameof(PurchaseOrder))
            {
                Id = p.Id,
                Name = $"{p.OrderNumber} — {p.Title}",
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
