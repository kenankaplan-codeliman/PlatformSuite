using CodePro.Domain.Entities.Suppliers;
using CodePro.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Platform.Application.Common.References;
using Platform.Application.Exceptions;
using Platform.Application.Modals.Common;

namespace CodePro.Infrastructure.References;

public class SupplierReferenceResolver : IEntityReferenceResolver
{
    private readonly CodeProDbContext dbContext;
    private readonly IConfiguration configuration;

    public SupplierReferenceResolver(CodeProDbContext dbContext, IConfiguration configuration)
    {
        this.dbContext = dbContext;
        this.configuration = configuration;
    }

    public string EntityType => nameof(Supplier);

    public EntityReference GetReference(Guid id)
    {
        var supplier = dbContext.Supplier
            .Select(s => new { s.Id, s.Name, s.ContactPersonEmail, s.ContactPersonPhone })
            .FirstOrDefault(s => s.Id == id) ?? throw new NotFoundException();

        return new EntityReference(nameof(Supplier))
        {
            Id = supplier.Id,
            Name = supplier.Name,
            Email = supplier.ContactPersonEmail,
            Phone = supplier.ContactPersonPhone,
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

        var tempQuery = dbContext.Supplier.AsNoTracking().Where(x => x.IsActive);

        if (!string.IsNullOrEmpty(searchText))
        {
            tempQuery = tempQuery.Where(s => EF.Functions.ILike(s.Name, $"%{searchText}%"));
        }

        var entityList = tempQuery
            .Select(s => new { s.Id, s.Name, s.ContactPersonEmail, s.ContactPersonPhone })
            .Skip(skipCnt).Take(pageSize + 1).ToList();

        var hasMore = entityList.Count > pageSize;

        var result = entityList.Take(pageSize)
            .Select(s => new EntityReference(nameof(Supplier))
            {
                Id = s.Id,
                Name = s.Name,
                Email = s.ContactPersonEmail,
                Phone = s.ContactPersonPhone,
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
