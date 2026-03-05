using Azure;
using CRM.Application.Exceptions;
using CRM.Application.Interfaces;
using CRM.Application.Modals.Common;
using CRM.Application.Modals.LeadModal;
using CRM.Application.Modals.OpportunityModal;
using CRM.Domain.Entities.Identities;
using CRM.Domain.Entities.Leads;
using CRM.Domain.Entities.Opportunities;
using CRM.Domain.Enums;
using CRM.Infrastructure.Data;
using CRM.Infrastructure.Data.Repositories;
using Microsoft.Build.Tasks.Deployment.ManifestUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Infrastructure.Repositories
{

    public class LeadRepository : BaseEntityRepository<Lead>, ILeadRepository
    {
        public LeadRepository(DatabaseContext dbContext) : base(dbContext)
        {
        }

        public override async Task<Lead?> GetAsync(Guid Id, CancellationToken cancellationToken = default)
        {
            return await dbContext.Lead
                .FirstOrDefaultAsync(o => o.Id == Id, cancellationToken);
        }

        public async Task<PaginationResult<LeadListItem>> List(LeadListFilter filter, PaginationInfo paginationInfo, CancellationToken cancellationToken = default)
        {
            var query = this.dbContext.Lead.AsNoTracking();

            if (!string.IsNullOrEmpty(filter.CompanyName))
                query = query.Where(e => EF.Functions.ILike(e.CompanyName, $"%{filter.CompanyName}%")); 

            if (!string.IsNullOrEmpty(filter.FirstName))
                query = query.Where(e => EF.Functions.ILike(e.FirstName, $"%{filter.FirstName}%"));

            if (!string.IsNullOrEmpty(filter.LastName))
                query = query.Where(e => EF.Functions.ILike(e.LastName, $"%{filter.LastName}%"));

            if (filter.LeadStatus.HasValue)
                query = query.Where(e => e.LeadStatus == filter.LeadStatus.Value);

            if (filter.LeadSource.HasValue)
                query = query.Where(e => e.LeadSource == filter.LeadSource.Value);

            if (filter.LeadRating.HasValue)
                query = query.Where(e => e.LeadRating == filter.LeadRating.Value);

            if (!string.IsNullOrEmpty(filter.Industry))
                query = query.Where(e => e.Industry != null && EF.Functions.ILike(e.Industry, $"%{filter.Industry}%"));

            if (filter.IsActive != null)
                query = query.Where(e => e.IsActive.Equals(filter.IsActive));


            var pageIndex = (paginationInfo.Page - 1) >= 0
               ? paginationInfo.Page - 1
               : 0;

            var skipVal = pageIndex * paginationInfo.PageSize;

            var items = await query
                .Skip(skipVal)
                .Take(paginationInfo.PageSize + 1)
                .Select(l => new LeadListItem()
                {
                    id = l.Id,
                    CompanyName = l.CompanyName,
                    FirstName = l.FirstName,
                    LastName = l.LastName,
                    Email = l.Email,
                    MobilePhone = l.MobilePhone,
                    LeadStatus = l.LeadStatus,
                    LeadRating = l.LeadRating,
                    Industry = l.Industry,
                    EstimatedValue = l.EstimatedValue,
                    IsActive = l.IsActive
                })
                .ToListAsync(cancellationToken);

            var hasMore = items.Count > paginationInfo.PageSize;

            if (hasMore)
                items.RemoveAt(items.Count - 1);

            return new PaginationResult<LeadListItem>()
            {
                Data = items,
                HasMore = hasMore,
                Page = paginationInfo.Page,
                PageSize = paginationInfo.PageSize
            };

        }
    }


}
