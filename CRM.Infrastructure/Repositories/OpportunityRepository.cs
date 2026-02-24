
using CRM.Application.Exceptions;
using CRM.Application.Interfaces;
using CRM.Application.Modals.Common;
using CRM.Application.Modals.OpportunityModal;
using CRM.Domain.Entities.Opportunities;
using CRM.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories;

public class OpportunityRepository : IOpportunityRepository
{
    private readonly DatabaseContext dbContext;

    public OpportunityRepository(DatabaseContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public async Task<PaginationResult<OpportunityListItem>> List(
        OpportunityListFilters filter,
        PaginationInfo paginationInfo)
    {
        var query = this.dbContext.Opportunity.AsNoTracking();
            

        if (!string.IsNullOrWhiteSpace(filter.Name))
        {
            query = query.Where(x => EF.Functions.ILike(x.Name, $"%{filter.Name}%"));
        }

        if (filter.Stage.HasValue)
        {
            query = query.Where(x => x.Stage == filter.Stage.Value);
        }

        if (filter.AccountId.HasValue)
        {
            query = query.Where(x =>
                x.AccountId == filter.AccountId.Value);
        }

        if (filter.Source.HasValue)
        {
            query = query.Where(x =>
                x.Source == filter.Source.Value);
        }

        if (filter.IsActive.HasValue)
        {
            query = query.Where(x =>
                x.IsActive == filter.IsActive.Value);
        }

        var pageIndex = (paginationInfo.Page - 1) >= 0
            ? paginationInfo.Page - 1
            : 0;

        var skipVal = pageIndex * paginationInfo.PageSize;

        var items = await query
            .OrderByDescending(o => o.CreatedAt)
            .Skip(skipVal)
            .Take(paginationInfo.PageSize + 1)
            .Select(o => new OpportunityListItem
            {
                Id = o.Id,
                Name = o.Name,
                Stage = o.Stage,
                Probability = o.Probability,
                EstimatedValue = o.EstimatedValue,
                ActualValue = o.ActualValue,
                Currency = o.Currency,
                CloseDate = o.CloseDate,
                Source = o.Source,
                AccountId = o.AccountId,
                AccountName = o.Account.AccountName,
                ContactId = o.ContactId,
                ContactName = o.Contact != null ? $"{o.Contact.FirstName} {o.Contact.LastName}" : null,
                IsActive = o.IsActive
            })
            .ToListAsync();

        var hasMore = items.Count > paginationInfo.PageSize;

        if (hasMore)
            items.RemoveAt(items.Count - 1);

        return new PaginationResult<OpportunityListItem>()
        {
            Data = items,
            HasMore = hasMore,
            Page = paginationInfo.Page,
            PageSize = paginationInfo.PageSize
        };
    }

    public Opportunity Get(Guid id)
    {
        var entity = this.dbContext.Opportunity
            .Include(o => o.Products)
            .Include(o => o.Account)
            .Include(o => o.Contact)
            .FirstOrDefault(o => o.Id == id)
            ?? throw new NotFoundException();

        return entity;
    }

    public Opportunity Create(Opportunity entity)
    {
        var entry = this.dbContext.Opportunity.Add(entity);
        return entry.Entity;
    }

    public Opportunity Update(Opportunity entity)
    {
        var entry = this.dbContext.Opportunity.Update(entity);
        return entry.Entity;
    }

    public Opportunity Delete(Opportunity entity)
    {
        var entry = this.dbContext.Opportunity.Remove(entity);
        return entry.Entity;
    }
}
