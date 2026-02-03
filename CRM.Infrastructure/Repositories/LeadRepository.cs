using Azure;
using CRM.Application.Interfaces;
using CRM.Application.Modals.Common;
using CRM.Application.Modals.LeadModal;
using CRM.Domain.Entities.Identity;
using CRM.Domain.Entities.Lead;
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
        private readonly IConfiguration _config;
        private readonly DatabaseContext dbContext;

        public LeadRepository(DatabaseContext dbContext, IConfiguration _config)
        {
            this.dbContext = dbContext;
            this._config = _config;
        }

        public async Task<Lead> CreateAsync(Lead entity)
        {
            var entry = this.dbContext.Lead.Add(entity);
            return entry.Entity;
        }

        public async Task<Lead> UpdateAsync(Lead entity)
        {
            var entry = this.dbContext.Lead.Update(entity);
            return entry.Entity;
        }

        public async Task<Lead> DeleteAsync(Lead entity)
        {
            var entry = this.dbContext.Lead.Remove(entity);
            return entry.Entity;
        }

        public async Task<Lead?> GetAsync(Guid Id)
        {
            var entity = await this.dbContext.Lead.FirstOrDefaultAsync(e => e.Id == Id);
            return entity;
        }

        public async Task<PaginationResult<Lead>> ListAsync(LeadListFilter? filter, PaginationInfo? paginationInfo)
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

        public async Task<PaginationResult<EntityReference>> Search(string searchText, PaginationInfo? paginationInfo)
        {

            if (string.IsNullOrEmpty(searchText))
                return new PaginationResult<EntityReference>()
                {
                    Data = new List<EntityReference>(),
                    HasMore = false,
                };


            int pageSize = int.Parse(_config["Search_Max_Record"]!);
            int skipCnt = 0;

            if (paginationInfo != null && paginationInfo.isValid())
            {
                pageSize = paginationInfo.PageSize;

                var pageIndex = (paginationInfo.Page - 1) >= 0 ? paginationInfo.Page - 1 : 0;
                skipCnt = pageIndex * paginationInfo.PageSize;

            }

            var query = from lead in this.dbContext.Lead.AsNoTracking()
                        where
                        lead.IsActive
                        && (
                            EF.Functions.ILike(lead.CompanyName, $"%{searchText}%")
                           || EF.Functions.ILike((lead.FirstName + " " + lead.LastName), $"%{searchText}%")
                           )
                        select new
                        {
                            lead.Id,
                            lead.CompanyName,
                            lead.FirstName,
                            lead.LastName,
                            lead.Email,
                            lead.Phone,
                            lead.MobilePhone
                        };


            var entityList = query.Skip(skipCnt).Take(pageSize + 1).ToList();

            var hasMore = entityList.Count > pageSize;

            var modalList = entityList.Take(pageSize)
                .Select(item => new EntityReference(EntityType.Lead)
                {
                    Id = item.Id,
                    Company = item.CompanyName,
                    Name = $"{item.FirstName} {item.LastName}",
                    Email = item.Email,
                    Phone = item.MobilePhone ?? item.Phone,
                })
                .ToList();

            return new PaginationResult<EntityReference>()
            {
                Data = modalList,
                HasMore = hasMore,
                Page = paginationInfo?.Page ?? 1,
                PageSize = pageSize,
            };



        }

    }


}
