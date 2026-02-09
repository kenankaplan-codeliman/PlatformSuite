using CRM.Application.Interfaces;
using CRM.Application.Modals.ActivityModal;
using CRM.Application.Modals.Common;
using CRM.Domain.Entities.Activity;
using CRM.Domain.Enums;
using CRM.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using EntityType = CRM.Domain.Enums.EntityType;

namespace CRM.Infrastructure.Repositories;

public class ActivityRepository : IActivityRepository
{
    private readonly DatabaseContext _dbContext;

    public ActivityRepository(DatabaseContext dbContext)
    {
        _dbContext = dbContext;
    }

    public ActivityListResponse List(ActivityListFilters? filters, PaginationInfo? paginationInfo)
    {
        var query = BuildFilteredQuery(filters);

        if (paginationInfo?.isValid() == true)
        {
            var pageIndex = Math.Max(0, paginationInfo.Page - 1);
            var skipCount = pageIndex * paginationInfo.PageSize;

            // Veritabanında projection yap - abstract class sorununu önler
            var projectedQuery = query
                .Skip(skipCount)
                .Take(paginationInfo.PageSize + 1);
                

            var results = projectedQuery.ToList();
            var hasMore = results.Count > paginationInfo.PageSize;

            return new ActivityListResponse
            {
                Data = results.Take(paginationInfo.PageSize).Select(MapToModal).ToList(),
                HasMore = hasMore,
                Page = paginationInfo.Page,
                PageSize = paginationInfo.PageSize,
            };
        }

        var allResults = query
            .Select(a => new ActivityProjection
            {
                Id = a.Id,
                ActivityType = a.ActivityType,
                Subject = a.Subject,
                Status = a.Status,
                Priority = a.Priority,
                StartDate = a.StartDate,
                EndDate = a.EndDate,
                DueDate = a.DueDate,
                IsActive = a.IsActive,
                OwnerId = a.OwnerId,
                RegardingEntityType = a.RegardingEntityType,
                RegardingEntityId = a.RegardingEntityId
            })
            .ToList();

        return new ActivityListResponse
        {
            Data = allResults.Select(MapToModal).ToList(),
            HasMore = false,
            Page = 0,
            PageSize = 0,
        };
    }

    public List<ActivityListItem> Calendar(ActivityListFilters? filters, DateTime startDate, DateTime endDate)
    {
        var query = BuildFilteredQuery(filters);

        // Tarih aralığıyla kesişen aktiviteleri getir
        var results = query
            .Where(a =>
                (a.StartDate != null && a.StartDate <= endDate && (a.EndDate == null || a.EndDate >= startDate)) ||
                (a.StartDate == null && a.EndDate != null && a.EndDate >= startDate && a.EndDate <= endDate))
            .ToList();

        return results.Select(MapToModal).ToList();
    }

    #region Private Methods

    private IQueryable<ActivityProjection> BuildFilteredQuery(ActivityListFilters? filters)
    {
        var query =
            from a in _dbContext.Activity.AsNoTracking().IgnoreAutoIncludes()
            join u in _dbContext.AppUser.AsNoTracking()
                on a.OwnerId equals u.Id into userGroup
            from u in userGroup.DefaultIfEmpty()
            select new { Activity = a, User = u };

        if (filters != null)
        {
            if (!string.IsNullOrWhiteSpace(filters.Subject))
                query = query.Where(q =>
                    EF.Functions.ILike(q.Activity.Subject, $"%{filters.Subject}%"));

            if (filters.ActivityType != null)
                query = query.Where(q => q.Activity.ActivityType == filters.ActivityType);

            if (filters.Status != null)
                query = query.Where(q => q.Activity.Status == filters.Status);

            if (filters.Priority != null)
                query = query.Where(q => q.Activity.Priority == filters.Priority);

            if (filters.RegardingEntityType != null)
                query = query.Where(q => q.Activity.RegardingEntityType == filters.RegardingEntityType);

            if (filters.RegardingEntityId != null)
                query = query.Where(q => q.Activity.RegardingEntityId == filters.RegardingEntityId);

            if (filters.DueDateFrom != null)
                query = query.Where(q => q.Activity.DueDate >= filters.DueDateFrom);

            if (filters.DueDateTo != null)
                query = query.Where(q => q.Activity.DueDate <= filters.DueDateTo);

            if (filters.OwnerId != null)
                query = query.Where(q => q.Activity.OwnerId == filters.OwnerId);

            if (filters.IsActive != null)
                query = query.Where(q => q.Activity.IsActive == filters.IsActive);
        }

        return query.Select(q => new ActivityProjection
        {
            Id = q.Activity.Id,
            ActivityType = q.Activity.ActivityType,
            Subject = q.Activity.Subject,
            Status = q.Activity.Status,
            Priority = q.Activity.Priority,
            StartDate = q.Activity.StartDate,
            EndDate = q.Activity.EndDate,
            DueDate = q.Activity.DueDate,
            IsActive = q.Activity.IsActive,
            OwnerId = q.Activity.OwnerId,
            OwnerIdFirstName = q.User != null ? q.User.FirstName : null,
            OwnerIdLastName = q.User != null ? q.User.LastName : null
        });
    }


    private static ActivityListItem MapToModal(ActivityProjection p)
    {
        var modal = new ActivityListItem(p.ActivityType)
        {
            Id = p.Id,
            Subject = p.Subject,
            Status = p.Status,
            Priority = p.Priority,
            StartDate = p.StartDate,
            EndDate = p.EndDate,
            DueDate = p.DueDate,
            IsActive = p.IsActive,
            Owner = new EntityReference(EntityType.User) { 
                Id = p.OwnerId ?? Guid.Empty,
                Name = $"{p.OwnerIdFirstName} {p.OwnerIdLastName}".Trim()
            }
        };

        return modal;
    }

    #endregion

    #region Inner Classes

    private class ActivityProjection
    {
        public Guid Id { get; set; }
        public ActivityType ActivityType { get; set; }
        public string Subject { get; set; } = default!;
        public ActivityStatus Status { get; set; }
        public ActivityPriority Priority { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? DueDate { get; set; }
        public bool IsActive { get; set; }
        public Guid? OwnerId { get; set; }
        public string? OwnerIdFirstName { get; set; }
        public string? OwnerIdLastName { get; set; }
        public EntityType? RegardingEntityType { get; set; }
        public Guid? RegardingEntityId { get; set; }
    }

    #endregion
}