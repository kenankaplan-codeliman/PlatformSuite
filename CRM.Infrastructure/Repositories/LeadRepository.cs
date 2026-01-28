using CRM.Application.Interfaces;
using CRM.Application.Modals.LeadModal;
using CRM.Domain.Entities.Lead;
using CRM.Infrastructure.Data;
using Microsoft.Build.Tasks.Deployment.ManifestUtilities;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Infrastructure.Repositories
{
    public class LeadRepository : ILeadRepository
    {
        private readonly DatabaseContext dbContext;

        public LeadRepository(DatabaseContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<LeadListResponse> ListAsync(LeadListFilter? filter, int page, int pageSize) {

            var query = this.dbContext.Lead.AsQueryable();

            if (filter != null) {

                if (!string.IsNullOrEmpty(filter.CompanyName))
                    query = query.Where(e => e.CompanyName.Contains(filter.CompanyName));

                if (!string.IsNullOrEmpty(filter.FirstName))
                    query = query.Where(e => e.FirstName.Contains(filter.FirstName));

                if (!string.IsNullOrEmpty(filter.LastName))
                    query = query.Where(e => e.LastName.Contains(filter.LastName));

                if (filter.LeadStatus.HasValue)
                    query = query.Where(e => e.LeadStatus == filter.LeadStatus.Value);

                if (filter.LeadSource.HasValue)
                    query = query.Where(e => e.LeadSource == filter.LeadSource.Value);

                if (filter.LeadRating.HasValue)
                    query = query.Where(e => e.LeadRating == filter.LeadRating.Value);

                if (!string.IsNullOrEmpty(filter.Industry))
                    query = query.Where(e => e.Industry != null && e.Industry.Contains(e.Industry));

                if (filter.IsActive!=null)
                    query = query.Where(e => e.IsActive.Equals(filter.IsActive));
            }

            var skipVal = page * pageSize;

            query = query.Skip(skipVal).Take(pageSize+1); // +1 for hasMore

            var entityList = query.ToList();

            var hasMore = entityList.Count > pageSize;

            var modalList = entityList.Select(e => LeadListItem.fromEntity(e)).Take(pageSize).ToList();

            return new LeadListResponse() { 
                Data = modalList,
                HasMore = hasMore, 
                Page = page,
                PageSize = pageSize,
            };
        }

        public async Task<Lead?> GetAsync(Guid Id) { 
            throw new NotImplementedException();    
        }
        public async Task UpdateAsync(Lead entity) {
            throw new NotImplementedException();
        }
        public async Task CreateAsync(Lead entity) {
            throw new NotImplementedException();
        }
        public async Task DeleteAsync(Lead entity) {
            throw new NotImplementedException();
        }
    }

 
}
