using CodePro.Domain.Entities.Products;
using CodePro.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Platform.Application.Common.References;
using Platform.Application.Exceptions;
using Platform.Application.Modals.Common;

namespace CodePro.Infrastructure.References;

public class ProductReferenceResolver : IEntityReferenceResolver
{
    private readonly CodeProDbContext dbContext;
    private readonly IConfiguration configuration;

    public ProductReferenceResolver(CodeProDbContext dbContext, IConfiguration configuration)
    {
        this.dbContext = dbContext;
        this.configuration = configuration;
    }

    public string EntityType => nameof(Product);

    public EntityReference GetReference(Guid id)
    {
        var product = dbContext.Product
            .Select(p => new { p.Id, p.Code, p.Name })
            .FirstOrDefault(p => p.Id == id) ?? throw new NotFoundException();

        return new EntityReference(nameof(Product))
        {
            Id = product.Id,
            Name = $"{product.Code} — {product.Name}",
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
                EF.Functions.ILike(p.Code, pattern)
                || EF.Functions.ILike(p.Name, pattern));
        }

        var entityList = tempQuery
            .Select(p => new { p.Id, p.Code, p.Name })
            .Skip(skipCnt).Take(pageSize + 1).ToList();

        var hasMore = entityList.Count > pageSize;

        var result = entityList.Take(pageSize)
            .Select(p => new EntityReference(nameof(Product))
            {
                Id = p.Id,
                Name = $"{p.Code} — {p.Name}",
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
