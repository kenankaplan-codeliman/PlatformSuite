using Azure;
using CRM.Application.Exceptions;
using CRM.Application.Interfaces;
using CRM.Application.Modals.Common;
using CRM.Application.Modals.LeadModal;
using CRM.Domain.Entities.Identities;
using CRM.Domain.Entities.Leads;
using CRM.Domain.Enums;
using CRM.Infrastructure.Data;
using Microsoft.Build.Tasks.Deployment.ManifestUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

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

        public Lead Create(Lead entity)
        {
            var entry = this.dbContext.Lead.Add(entity);
            return entry.Entity;
        }

        public Lead Update(Lead entity)
        {
            var entry = this.dbContext.Lead.Update(entity);
            return entry.Entity;
        }

        public Lead Delete(Lead entity)
        {
            var entry = this.dbContext.Lead.Remove(entity);
            return entry.Entity;
        }

        public Lead Get(Guid Id)
        {
            var entity = this.dbContext.Lead.FirstOrDefault(e => e.Id == Id) ?? throw new NotFoundException();
            return entity;
        }

        public PaginationResult<Lead> List(LeadListFilter? filter, PaginationInfo? paginationInfo)
        {

            var query = this.dbContext.Lead.AsNoTracking();

            if (filter != null)
            {

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

                if (filter.IsActive != null)
                    query = query.Where(e => e.IsActive.Equals(filter.IsActive));
            }


            if (paginationInfo != null && paginationInfo.isValid())
            {
                var pageIndex = (paginationInfo.Page - 1) >= 0 ? paginationInfo.Page - 1 : 0;

                var skipVal = pageIndex * paginationInfo.PageSize;

                query = query.Skip(skipVal).Take(paginationInfo.PageSize + 1); // +1 for hasMore

                var entityList = query.ToList();

                var hasMore = entityList.Count > paginationInfo.PageSize;

                var modalList = entityList.Take(paginationInfo.PageSize).ToList();

                return new PaginationResult<Lead>()
                {
                    Data = modalList,
                    HasMore = hasMore,
                    Page = paginationInfo.Page,
                    PageSize = paginationInfo.PageSize,
                };
            }
            else
            {
                var entityList = query.ToList();

                return new PaginationResult<Lead>()
                {
                    Data = entityList,
                    HasMore = false,
                    Page = 0,
                    PageSize = 0,
                };
            }


        }
    }


}
