using Platform.Application.Exceptions;
using Platform.Application.Interfaces;
using Platform.Application.Modals.Common;
using Platform.Domain.Enums;
using Platform.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Platform.Infrastructure.Repositories
{
    public class ReferenceRepository : IReferenceRepository
    {
        private readonly IConfiguration configuration;
        private readonly PlatformDbContext dbContext;

        public ReferenceRepository(PlatformDbContext dbContext, IConfiguration config)
        {
            this.dbContext = dbContext;
            this.configuration = config;
        }


        public EntityReference GetReference(EntityType entityType, Guid id) =>
                 entityType switch
                 {
                     EntityType.User => GetUserReference(id),
                     EntityType.Account => GetAccountReference(id),
                     EntityType.Contact => GetContactReference(id),

                     _ => throw new NotImplementedException()
                 };

        public EntityReferenceList LookupReference(EntityType entityType, string searchText, PaginationInfo paginationInfo) =>
                 entityType switch
                 {
                     EntityType.User => LookupUserReference(searchText, paginationInfo),
                     EntityType.Account => LookupAccountReference(searchText, paginationInfo),
                     EntityType.Contact => LookupContactReference(searchText, paginationInfo),

                     _ => throw new NotImplementedException()
                 };


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
            });


            var entityList = query.Skip(skipCnt).Take(pageSize + 1).ToList();

            var hasMore = entityList.Count > pageSize;

            var modalList = entityList.Take(pageSize)
                .Select(item => new EntityReference(EntityType.User)
                {
                    Id = item.Id,
                    Name = $"{item.FirstName} {item.LastName}",
                    Email = item.Email,
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
                var pattern = $"%{searchText}%";
                tempQuery = tempQuery.Where(x => EF.Functions.ILike(x.FirstName + " " + x.LastName, pattern));
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
    }
}
