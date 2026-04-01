using CRM.Application.Exceptions;
using CRM.Application.Interfaces;
using CRM.Application.Modals.Common;
using CRM.Application.Modals.ContactModal;
using CRM.Domain.Entities.Contacts;
using CRM.Domain.Entities.Leads;
using CRM.Infrastructure.Data;
using CRM.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories;

public class ContactRepository : BaseEntityRepository<Contact>, IContactRepository
{
    public ContactRepository(DatabaseContext dbContext) : base(dbContext)
    {
    }

    public async Task<PaginationResult<ContactListItem>> List(ContactListFilters filter, PaginationInfo paginationInfo)
    {
        var query = this.dbContext.Contact.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(filter.ContactName))
        {
            var pattern = $"%{filter.ContactName}%";

            query = query.Where(x => EF.Functions.ILike(
                x.FirstName + " " + x.LastName, pattern));
        }

        if (filter.AccountId!=null && !Guid.Empty.Equals(filter.AccountId))
        {
            query = query.Where(x => x.AccountContacts.Any(ac => ac.AccountId == filter.AccountId));
        }

        if (!string.IsNullOrWhiteSpace(filter.Title))
        {
            query = query.Where(x => EF.Functions.ILike(x.Title!, $"%{filter.Title}%"));
        }

        if (!string.IsNullOrWhiteSpace(filter.Department))
        {
            query = query.Where(x => EF.Functions.ILike(x.Department!, $"%{filter.Department}%"));
        }

        if (filter.IsActive.HasValue)
        {
            query = query.Where(x => x.IsActive == filter.IsActive.Value);
        }

        if (filter.ContactStatus.HasValue)
        {
            query = query.Where(x => x.ContactStatus == filter.ContactStatus.Value);
        }

        query = query.Include(c => c.AccountContacts).ThenInclude(ac => ac.Account);


        var pageIndex = (paginationInfo.Page - 1) >= 0 ? paginationInfo.Page - 1 : 0;
        var skipVal = pageIndex * paginationInfo.PageSize;

        var items = query
            .Skip(skipVal)
            .Take(paginationInfo.PageSize + 1)
            .Select(c => new ContactListItem
            {
                Id = c.Id,
                FirstName = c.FirstName,
                LastName = c.LastName,
                FullName = c.DisplayName,
                ContactStatus = c.ContactStatus,
                Title = c.Title,
                Department = c.Department,
                PrimaryAccount = c.AccountContacts
                    .OrderByDescending(ac => ac.IsPrimary)
                    .Select(ac => new ContactAccountModal() { 
                        Id = ac.Id,
                        AccountId = ac.AccountId,
                        AccountName = ac.Account.AccountName,
                        Role = ac.Role, 
                        IsPrimary = ac.IsPrimary,
                    })
                    .FirstOrDefault(),
                PrimaryEmail = c.Emails
                    .Where(e => e.IsPrimary)
                    .Select(e => e.Email)
                    .FirstOrDefault(),
                PrimaryPhone = c.Phones
                    .Where(p => p.IsPrimary)
                    .Select(p => p.PhoneNumber)
                    .FirstOrDefault(),
                IsActive = c.IsActive
            })
            .ToList();

        var hasMore = items.Count > paginationInfo.PageSize;

        if (hasMore)
            items.RemoveAt(items.Count - 1);

        return new PaginationResult<ContactListItem>()
        {
            Data = items,
            HasMore = hasMore,
            Page = paginationInfo.Page,
            PageSize = paginationInfo.PageSize,
        };
    }

    public override async Task<Contact?> GetAsync(Guid Id, CancellationToken cancellationToken = default)
    {
        return await this.dbContext.Contact
            .Include(c => c.Emails)
            .Include(c => c.Phones)
            .Include(c => c.Addresses)
            .Include(c => c.AccountContacts).ThenInclude(ac => ac.Account)
            .FirstOrDefaultAsync(e => e.Id == Id, cancellationToken);
    }
}