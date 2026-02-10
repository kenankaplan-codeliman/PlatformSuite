using CRM.Application.Exceptions;
using CRM.Application.Interfaces;
using CRM.Application.Modals.Common;
using CRM.Domain.Enums;
using CRM.Infrastructure.Data;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Infrastructure.Repositories
{
    public class ReferenceRepository : IReferenceRepository
    {
        private readonly IConfiguration configuration;
        private readonly DatabaseContext dbContext;

        public ReferenceRepository(DatabaseContext dbContext, IConfiguration config)
        {
            this.dbContext = dbContext;
            this.configuration = config;
        }


        public EntityReference GetReference(EntityType entityType, Guid id) =>
                 entityType switch
                 {
                     EntityType.User => GetUserReference(id),
                     EntityType.Lead => GetLeadReference(id),
                     _ => throw new NotImplementedException()
                 };

        public EntityReferenceList LookupReference(EntityType entityType, string searchText, PaginationInfo paginationInfo) =>
                 entityType switch
                 {
                     EntityType.User => LookupUserReference(searchText, paginationInfo),
                     EntityType.Lead => LookupLeadReference(searchText, paginationInfo),
                     _ => throw new NotImplementedException()
                 };


        #region Lead

        private EntityReferenceList LookupLeadReference(string searchText, PaginationInfo paginationInfo)
        {

            if (string.IsNullOrEmpty(searchText))
                return new EntityReferenceList()
                {
                    Data = new List<EntityReference>(),
                    HasMore = false,
                };


            int pageSize = int.Parse(configuration["DefaultValues:Search_Max_Record"]!);
            int skipCnt = 0;

            if (paginationInfo != null && paginationInfo.isValid())
            {
                pageSize = paginationInfo.PageSize;

                var pageIndex = (paginationInfo.Page - 1) >= 0 ? paginationInfo.Page - 1 : 0;
                skipCnt = pageIndex * paginationInfo.PageSize;

            }

            var tempQuery = this.dbContext.Lead.AsNoTracking().Where(lead => lead.IsActive);

            if (!string.IsNullOrEmpty(searchText))
            {

                tempQuery = tempQuery.Where(lead =>
                         EF.Functions.ILike(lead.CompanyName, $"%{searchText}%")
                         || EF.Functions.ILike((lead.FirstName + " " + lead.LastName), $"%{searchText}%")
                         );
            }

            var query = tempQuery.Select(lead => new
            {
                lead.Id,
                lead.CompanyName,
                lead.FirstName,
                lead.LastName,
                lead.Email,
                lead.Phone,
                lead.MobilePhone
            });

            var entityList = query.Skip(skipCnt).Take(pageSize + 1).ToList();

            var hasMore = entityList.Count > pageSize;

            var modalList = entityList.Take(pageSize)
                .Select(item => new EntityReference(EntityType.Lead)
                {
                    Id = item.Id,
                    Name = $"{item.FirstName} {item.LastName} ({item.CompanyName})",
                    Email = item.Email,
                    Phone = item.MobilePhone ?? item.Phone,
                })
                .ToList();

            return new EntityReferenceList()
            {
                Data = modalList,
                HasMore = hasMore,
                Page = paginationInfo?.Page ?? 1,
                PageSize = pageSize,
            };



        }
        private EntityReference GetLeadReference(Guid Id)
        {
            var lead = this.dbContext.Lead.Select(x => new { x.Id, x.CompanyName, x.FirstName, x.LastName, x.Email, x.MobilePhone, x.Phone })
                .FirstOrDefault(e => e.Id == Id) ?? throw new NotFoundException();

            return new EntityReference(EntityType.Lead)
            {
                Id = lead.Id,
                Name = $"{lead.FirstName} {lead.LastName} ({lead.CompanyName})",
                Email = lead.Email,
                Phone = lead.MobilePhone ?? lead.Phone,
            };

        }

        #endregion Lead

        #region User

        private EntityReferenceList LookupUserReference(string searchText, PaginationInfo paginationInfo)
        {
            int pageSize = int.Parse(configuration["DefaultValues:Search_Max_Record"]!);
            int skipCnt = 0;

            if (paginationInfo != null && paginationInfo.isValid())
            {
                pageSize = paginationInfo.PageSize;

                var pageIndex = (paginationInfo.Page - 1) >= 0 ? paginationInfo.Page - 1 : 0;
                skipCnt = pageIndex * paginationInfo.PageSize;

            }

            var tempQuery = this.dbContext.AppUser.AsNoTracking().Where(x => x.IsActive);

            if (!string.IsNullOrEmpty(searchText))
            {
                tempQuery = tempQuery.Where(usr =>
                         EF.Functions.ILike(usr.Email, $"%{searchText}%")
                        && EF.Functions.ILike((usr.FirstName + " " + usr.LastName), $"%{searchText}%"));
            }

            var query = tempQuery.Select(usr => new
            {
                usr.Id,
                usr.FirstName,
                usr.LastName,
                usr.Email,
                //usr.Phone,
                //usr.MobilePhone
            });


            var entityList = query.Skip(skipCnt).Take(pageSize + 1).ToList();

            var hasMore = entityList.Count > pageSize;

            var modalList = entityList.Take(pageSize)
                .Select(item => new EntityReference(EntityType.User)
                {
                    Id = item.Id,
                    Name = $"{item.FirstName} {item.LastName}",
                    Email = item.Email,
                    //Phone = item.MobilePhone ?? item.Phone,
                })
                .ToList();

            return new EntityReferenceList()
            {
                Data = modalList,
                HasMore = hasMore,
                Page = paginationInfo?.Page ?? 1,
                PageSize = pageSize,
            };
        }
        private EntityReference GetUserReference(Guid Id)
        {
            var usr = dbContext.AppUser.Select(x => new { x.Id, x.FirstName, x.LastName, x.Email }).FirstOrDefault(x => x.Id == Id) ?? throw new NotFoundException();

            return new EntityReference(EntityType.User)
            {
                Id = usr.Id,
                Name = $"{usr.FirstName} {usr.LastName}",
                Email = usr.Email,
            };
        }

        #endregion User
    }
}
