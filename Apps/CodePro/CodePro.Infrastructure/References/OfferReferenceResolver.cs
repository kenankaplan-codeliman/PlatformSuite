using CodePro.Domain.Entities.Offers;
using CodePro.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Platform.Application.Common.References;
using Platform.Application.Exceptions;
using Platform.Application.Modals.Common;

namespace CodePro.Infrastructure.References;

public class OfferReferenceResolver : IEntityReferenceResolver
{
    private readonly CodeProDbContext dbContext;
    private readonly IConfiguration configuration;

    public OfferReferenceResolver(CodeProDbContext dbContext, IConfiguration configuration)
    {
        this.dbContext = dbContext;
        this.configuration = configuration;
    }

    public string EntityType => nameof(Offer);

    public EntityReference GetReference(Guid id)
    {
        var offer = dbContext.Offer
            .Select(o => new { o.Id, o.OfferNumber, o.Subject })
            .FirstOrDefault(o => o.Id == id) ?? throw new NotFoundException();

        return new EntityReference(nameof(Offer))
        {
            Id = offer.Id,
            Name = $"{offer.OfferNumber} — {offer.Subject}",
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

        var tempQuery = dbContext.Offer.AsNoTracking();

        if (!string.IsNullOrEmpty(searchText))
        {
            var pattern = $"%{searchText}%";
            tempQuery = tempQuery.Where(o =>
                EF.Functions.ILike(o.OfferNumber, pattern)
                || EF.Functions.ILike(o.Subject, pattern));
        }

        var entityList = tempQuery
            .Select(o => new { o.Id, o.OfferNumber, o.Subject })
            .Skip(skipCnt).Take(pageSize + 1).ToList();

        var hasMore = entityList.Count > pageSize;

        var result = entityList.Take(pageSize)
            .Select(o => new EntityReference(nameof(Offer))
            {
                Id = o.Id,
                Name = $"{o.OfferNumber} — {o.Subject}",
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
