using CodePro.Domain.Entities.Contracts;
using CodePro.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Platform.Application.Common.References;
using Platform.Application.Exceptions;
using Platform.Application.Modals.Common;

namespace CodePro.Infrastructure.References;

public class ContractReferenceResolver : IEntityReferenceResolver
{
    private readonly CodeProDbContext dbContext;
    private readonly IConfiguration configuration;

    public ContractReferenceResolver(CodeProDbContext dbContext, IConfiguration configuration)
    {
        this.dbContext = dbContext;
        this.configuration = configuration;
    }

    public string EntityType => nameof(Contract);

    public EntityReference GetReference(Guid id)
    {
        var contract = dbContext.Contract
            .Select(c => new { c.Id, c.ContractNumber, c.Subject })
            .FirstOrDefault(c => c.Id == id) ?? throw new NotFoundException();

        return new EntityReference(nameof(Contract))
        {
            Id = contract.Id,
            Name = $"{contract.ContractNumber} — {contract.Subject}",
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

        var tempQuery = dbContext.Contract.AsNoTracking();

        if (!string.IsNullOrEmpty(searchText))
        {
            var pattern = $"%{searchText}%";
            tempQuery = tempQuery.Where(c =>
                EF.Functions.ILike(c.ContractNumber, pattern)
                || EF.Functions.ILike(c.Subject, pattern));
        }

        var entityList = tempQuery
            .Select(c => new { c.Id, c.ContractNumber, c.Subject })
            .Skip(skipCnt).Take(pageSize + 1).ToList();

        var hasMore = entityList.Count > pageSize;

        var result = entityList.Take(pageSize)
            .Select(c => new EntityReference(nameof(Contract))
            {
                Id = c.Id,
                Name = $"{c.ContractNumber} — {c.Subject}",
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
