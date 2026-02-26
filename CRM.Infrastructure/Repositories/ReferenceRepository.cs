using CRM.Application.Exceptions;
using CRM.Application.Interfaces;
using CRM.Application.Modals.Common;
using CRM.Domain.Enums;
using CRM.Infrastructure.Data;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Graph.Models.ExternalConnectors;
using Microsoft.IdentityModel.Tokens;
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
                     EntityType.Account => GetAccountReference(id),
                     EntityType.Contact => GetContactReference(id),
                     EntityType.Opportunity => GetOpportunityReference(id),
                     EntityType.Product => GetProductReference(id),

                     _ => throw new NotImplementedException()
                 };

        public EntityReferenceList LookupReference(EntityType entityType, string searchText, PaginationInfo paginationInfo) =>
                 entityType switch
                 {
                     EntityType.User => LookupUserReference(searchText, paginationInfo),
                     EntityType.Lead => LookupLeadReference(searchText, paginationInfo),
                     EntityType.Account => LookupAccountReference(searchText, paginationInfo),
                     EntityType.Contact => LookupContactReference(searchText, paginationInfo),
                     EntityType.Opportunity => LookupOpportunityReference(searchText, paginationInfo),
                     EntityType.Product => LookupProductReference(searchText, paginationInfo),

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

        #region Account

        private EntityReferenceList LookupAccountReference(string searchText, PaginationInfo paginationInfo)
        {
            int pageSize = int.Parse(configuration["DefaultValues:Search_Max_Record"]!);
            int skipCnt = 0;

            if (paginationInfo != null && paginationInfo.isValid())
            {
                pageSize = paginationInfo.PageSize;

                var pageIndex = (paginationInfo.Page - 1) >= 0 ? paginationInfo.Page - 1 : 0;
                skipCnt = pageIndex * paginationInfo.PageSize;

            }

            var tempQuery = this.dbContext.Account.AsNoTracking().Where(x => x.IsActive);

            if (!string.IsNullOrEmpty(searchText))
            {
                tempQuery = tempQuery.Where(acc => EF.Functions.ILike(acc.AccountName, $"%{searchText}%"));
            }

            var query = tempQuery.Select(acc => new
            {
                acc.Id,
                acc.AccountName,
                PrimaryEmail = acc.Emails
                  .Where(e => e.IsPrimary && !e.IsDeleted)
                  .Select(e => e.Email)
                  .FirstOrDefault(),
                PrimaryPhone = acc.Phones
                  .Where(p => p.IsPrimary && !p.IsDeleted)
                  .Select(p => p.PhoneNumber)
                  .FirstOrDefault(),
            });


            var entityList = query.Skip(skipCnt).Take(pageSize + 1).ToList();

            var hasMore = entityList.Count > pageSize;

            var acoountlist = entityList.Take(pageSize)
                .Select(acc => new EntityReference(EntityType.Account)
                {
                    Id = acc.Id,
                    Name = acc.AccountName,
                    Email = acc.PrimaryEmail,
                    Phone = acc.PrimaryPhone,
                })
                .ToList();

            return new EntityReferenceList()
            {
                Data = acoountlist,
                HasMore = hasMore,
                Page = paginationInfo?.Page ?? 1,
                PageSize = pageSize,
            };
        }
        private EntityReference GetAccountReference(Guid Id)
        {
            var account = dbContext.Account.Select(acc => new {
                acc.Id,
                acc.AccountName,
                PrimaryEmail = acc.Emails
                  .Where(e => e.IsPrimary && !e.IsDeleted)
                  .Select(e => e.Email)
                  .FirstOrDefault(),
                PrimaryPhone = acc.Phones
                  .Where(p => p.IsPrimary && !p.IsDeleted)
                  .Select(p => p.PhoneNumber)
                  .FirstOrDefault(),
            }).FirstOrDefault(acc => acc.Id == Id) ?? throw new NotFoundException();

            return new EntityReference(EntityType.Account)
            {
                Id = account.Id,
                Name = account.AccountName,
                Email = account.PrimaryEmail,
                Phone = account.PrimaryPhone,
            };
        }

        #endregion Account

        #region Contact

        private EntityReferenceList LookupContactReference(string searchText, PaginationInfo paginationInfo)
        {
            int pageSize = int.Parse(configuration["DefaultValues:Search_Max_Record"]!);
            int skipCnt = 0;

            if (paginationInfo != null && paginationInfo.isValid())
            {
                pageSize = paginationInfo.PageSize;

                var pageIndex = (paginationInfo.Page - 1) >= 0 ? paginationInfo.Page - 1 : 0;
                skipCnt = pageIndex * paginationInfo.PageSize;

            }

            var tempQuery = this.dbContext.Contact.AsNoTracking().Where(x => x.IsActive);

            if (!string.IsNullOrEmpty(searchText))
            {
                tempQuery = tempQuery.Where(cnt => EF.Functions.ILike($"{cnt.FirstName} {cnt.LastName}", $"%{searchText}%"));
            }

            var query = tempQuery.Select(cnt => new
            {
                cnt.Id,
                cnt.FirstName,
                cnt.LastName,
                PrimaryEmail = cnt.Emails
                  .Where(e => e.IsPrimary && !e.IsDeleted)
                  .Select(e => e.Email)
                  .FirstOrDefault(),
                PrimaryPhone = cnt.Phones
                  .Where(p => p.IsPrimary && !p.IsDeleted)
                  .Select(p => p.PhoneNumber)
                  .FirstOrDefault(),
            });


            var entityList = query.Skip(skipCnt).Take(pageSize + 1).ToList();

            var hasMore = entityList.Count > pageSize;

            var contactList = entityList.Take(pageSize)
                .Select(item => new EntityReference(EntityType.Contact)
                {
                    Id = item.Id,
                    Name = $"{item.FirstName} {item.LastName}",
                    Email = item.PrimaryEmail,
                    Phone = item.PrimaryPhone,
                })
                .ToList();

            return new EntityReferenceList()
            {
                Data = contactList,
                HasMore = hasMore,
                Page = paginationInfo?.Page ?? 1,
                PageSize = pageSize,
            };
        }
        private EntityReference GetContactReference(Guid Id)
        {
            var contact = dbContext.Contact.Select(cnt => new {
                cnt.Id,
                cnt.FirstName,
                cnt.LastName,
                PrimaryEmail = cnt.Emails
                  .Where(e => e.IsPrimary && !e.IsDeleted)
                  .Select(e => e.Email)
                  .FirstOrDefault(),
                PrimaryPhone = cnt.Phones
                  .Where(p => p.IsPrimary && !p.IsDeleted)
                  .Select(p => p.PhoneNumber)
                  .FirstOrDefault(),
            }).FirstOrDefault(acc => acc.Id == Id) ?? throw new NotFoundException();

            return new EntityReference(EntityType.Contact)
            {
                Id = contact.Id,
                Name = $"{contact.FirstName} {contact.LastName}",
                Email = contact.PrimaryEmail,
                Phone = contact.PrimaryPhone,
            };
        }

        #endregion Contact


        #region Product

        private EntityReferenceList LookupProductReference(string searchText, PaginationInfo paginationInfo)
        {
            int pageSize = int.Parse(configuration["DefaultValues:Search_Max_Record"]!);
            int skipCnt = 0;

            if (paginationInfo != null && paginationInfo.isValid())
            {
                pageSize = paginationInfo.PageSize;

                var pageIndex = (paginationInfo.Page - 1) >= 0 ? paginationInfo.Page - 1 : 0;
                skipCnt = pageIndex * paginationInfo.PageSize;

            }

            var tempQuery = this.dbContext.Product.AsNoTracking().Where(x => x.IsActive);

            if (!string.IsNullOrEmpty(searchText))
            {
                tempQuery = tempQuery.Where(prd => EF.Functions.ILike(prd.Name, $"%{searchText}%"));
            }

            var query = tempQuery.Select(prd => new
            {
                prd.Id,
                prd.Name,
            });


            var entityList = query.Skip(skipCnt).Take(pageSize + 1).ToList();

            var hasMore = entityList.Count > pageSize;

            var contactList = entityList.Take(pageSize)
                .Select(item => new EntityReference(EntityType.Product)
                {
                    Id = item.Id,
                    Name = item.Name,
                    Email = null,
                    Phone = null,
                })
                .ToList();

            return new EntityReferenceList()
            {
                Data = contactList,
                HasMore = hasMore,
                Page = paginationInfo?.Page ?? 1,
                PageSize = pageSize,
            };
        }
        private EntityReference GetProductReference(Guid Id)
        {
            var product = dbContext.Product.Select(prd => new {
                prd.Id,
                prd.Name,
            }).FirstOrDefault(opp => opp.Id == Id) ?? throw new NotFoundException();

            return new EntityReference(EntityType.Product)
            {
                Id = product.Id,
                Name = product.Name,
                Email = null,
                Phone = null,
            };
        }

        #endregion Product


        #region Opportunity

        private EntityReferenceList LookupOpportunityReference(string searchText, PaginationInfo paginationInfo)
        {
            int pageSize = int.Parse(configuration["DefaultValues:Search_Max_Record"]!);
            int skipCnt = 0;

            if (paginationInfo != null && paginationInfo.isValid())
            {
                pageSize = paginationInfo.PageSize;

                var pageIndex = (paginationInfo.Page - 1) >= 0 ? paginationInfo.Page - 1 : 0;
                skipCnt = pageIndex * paginationInfo.PageSize;

            }

            var tempQuery = this.dbContext.Opportunity.AsNoTracking().Where(x => x.IsActive);

            if (!string.IsNullOrEmpty(searchText))
            {
                tempQuery = tempQuery.Where(opp => EF.Functions.ILike(opp.Name, $"%{searchText}%"));
            }

            var query = tempQuery.Select(opp => new
            {
                opp.Id,
                opp.Name,
            });


            var entityList = query.Skip(skipCnt).Take(pageSize + 1).ToList();

            var hasMore = entityList.Count > pageSize;

            var contactList = entityList.Take(pageSize)
                .Select(item => new EntityReference(EntityType.Opportunity)
                {
                    Id = item.Id,
                    Name = item.Name,
                    Email = null,
                    Phone = null,
                })
                .ToList();

            return new EntityReferenceList()
            {
                Data = contactList,
                HasMore = hasMore,
                Page = paginationInfo?.Page ?? 1,
                PageSize = pageSize,
            };
        }
        private EntityReference GetOpportunityReference(Guid Id)
        {
            var opportunity = dbContext.Opportunity.Select(opp => new {
                opp.Id,
                opp.Name,
            }).FirstOrDefault(opp => opp.Id == Id) ?? throw new NotFoundException();

            return new EntityReference(EntityType.Opportunity)
            {
                Id = opportunity.Id,
                Name = opportunity.Name,
                Email = null,
                Phone = null,
            };
        }

        #endregion Opportunity

    }
}
