using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Platform.Application.Common.References;
using Platform.Application.Exceptions;
using Platform.Application.Modals.Common;
using Crm.Domain.Entities.Products;
using Crm.Infrastructure.Data;

namespace Crm.Infrastructure.References;

public class ProductReferenceResolver : IEntityReferenceResolver
{
    private readonly CrmDbContext dbContext;
    private readonly IConfiguration configuration;

    public ProductReferenceResolver(CrmDbContext dbContext, IConfiguration configuration)
    {
        this.dbContext = dbContext;
        this.configuration = configuration;
    }

    public string EntityType => nameof(Product);

    public EntityReference GetReference(Guid id)
    {
        var product = dbContext.Product
            .Select(p => new { p.Id, p.Name })
            .FirstOrDefault(p => p.Id == id) ?? throw new NotFoundException();

        return new EntityReference(nameof(Product))
        {
            Id = product.Id,
            Name = product.Name,
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

        var tempQuery = dbContext.Product.AsNoTracking().Where(x => x.IsActive);

        if (!string.IsNullOrEmpty(searchText))
        {
            var pattern = $"%{searchText}%";
            tempQuery = tempQuery.Where(p =>
                EF.Functions.ILike(p.Name, pattern) || EF.Functions.ILike(p.ProductCode, pattern));
        }

        var entityList = tempQuery
            .Select(p => new { p.Id, p.Name })
            .Skip(skipCnt)
            .Take(pageSize + 1)
            .ToList();

        var hasMore = entityList.Count > pageSize;

        var productList = entityList.Take(pageSize)
            .Select(p => new EntityReference(nameof(Product))
            {
                Id = p.Id,
                Name = p.Name,
            })
            .ToList();

        return new EntityReferenceList
        {
            Data = productList,
            HasMore = hasMore,
            Page = paginationInfo?.Page ?? 1,
            PageSize = pageSize,
        };
    }
}
