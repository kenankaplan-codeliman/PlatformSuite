using CRM.Application.Exceptions;
using CRM.Application.Interfaces;
using CRM.Application.Modals.AccountModal;
using CRM.Application.Modals.Common;
using CRM.Domain.Entities.Accounts;
using CRM.Domain.Entities.Leads;
using CRM.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;

namespace CRM.Infrastructure.Repositories;


public class AccountRepository : IAccountRepository
{
    private readonly DatabaseContext dbContext;

    public AccountRepository(DatabaseContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public async Task<PaginationResult<AccountListItem>> List(AccountListFilter filter, PaginationInfo paginationInfo)
    {
        var query = this.dbContext.Account.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(filter.accountName))
        {
            query = query.Where(x => EF.Functions.ILike(x.AccountName, $"%{filter.accountName}%"));
        }

        if (filter.accountType.HasValue)
        {
            query = query.Where(x => x.AccountType == filter.accountType.Value);
        }

        if (!string.IsNullOrWhiteSpace(filter.Industry))
        {
            query = query.Where(x => EF.Functions.ILike(x.Industry!, $"%{filter.Industry}%"));
        }

        if (filter.isActive.HasValue)
        {
            query = query.Where(x => x.IsActive == filter.isActive.Value);
        }

        var pageIndex = (paginationInfo.Page - 1) >= 0 ? paginationInfo.Page - 1 : 0;

        var skipVal = pageIndex * paginationInfo.PageSize;

        var items = query
          .Skip(skipVal)
          .Take(paginationInfo.PageSize + 1)
          .Select(acc => new AccountListItem
          {
              Id = acc.Id,
              AccountName = acc.AccountName,
              AccountType = acc.AccountType,
              Industry = acc.Industry,
              AnnualRevenue = acc.AnnualRevenue,
              NumberOfEmployees = acc.NumberOfEmployees,
              Website = acc.Website,
              PrimaryEmail = acc.Emails
                  .Where(e => e.IsPrimary)
                  .Select(e => e.Email)
                  .FirstOrDefault(),
              PrimaryPhone = acc.Phones
                  .Where(p => p.IsPrimary)
                  .Select(p => p.PhoneNumber)
                  .FirstOrDefault(),
              PrimaryCity = acc.Addresses
                  .Where(a => a.IsPrimary)
                  .Select(a => a.City)
                  .FirstOrDefault(),
              IsActive = acc.IsActive
          })
          .ToList();



        var hasMore = items.Count > paginationInfo.PageSize;

        if (hasMore)
            items.RemoveAt(items.Count - 1);

        return new PaginationResult<AccountListItem>()
        {
            Data = items,
            HasMore = hasMore,
            Page = paginationInfo.Page,
            PageSize = paginationInfo.PageSize,
        };
    }

    public Account Get(Guid Id)
    {
        var entity = this.dbContext.Account
            .Include(a => a.Emails)
            .Include(a => a.Phones)
            .Include(a => a.Addresses)
            .Include(a => a.AccountContacts).ThenInclude(ac=> ac.Contact)
            .FirstOrDefault(e => e.Id == Id) 
            ?? throw new NotFoundException();

        return entity;
    }

    public Account Create(Account entity)
    {
        var entry = this.dbContext.Account.Add(entity);
        return entry.Entity;
    }

    public Account Delete(Account entity)
    {
        var entry = this.dbContext.Account.Remove(entity);
        return entry.Entity;
    }

    public Account Update(Account entity)
    {
        var entry = this.dbContext.Account.Update(entity);
        return entry.Entity;
    }
}
