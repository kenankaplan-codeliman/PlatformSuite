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
                .Take(paginationInfo.PageSize + 1)
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
                });

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

    public List<ActivityBaseModal> Calendar(ActivityListFilters? filters, DateTime startDate, DateTime endDate)
    {
        var query = BuildFilteredQuery(filters);

        // Tarih aralığıyla kesişen aktiviteleri getir
        var results = query
            .Where(a =>
                (a.StartDate != null && a.StartDate <= endDate && (a.EndDate == null || a.EndDate >= startDate)) ||
                (a.StartDate == null && a.EndDate != null && a.EndDate >= startDate && a.EndDate <= endDate))
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

        return results.Select(MapToModal).ToList();
    }

    #region Private Methods

    private IQueryable<ActivityBase> BuildFilteredQuery(ActivityListFilters? filters)
    {
        var query = _dbContext.Activity.AsNoTracking();

        if (filters == null)
            return query;

        if (!string.IsNullOrEmpty(filters.Subject))
            query = query.Where(a => EF.Functions.ILike(a.Subject, $"%{filters.Subject}%"));

        if (filters.ActivityType != null)
            query = query.Where(a => a.ActivityType == filters.ActivityType);

        if (filters.Status != null)
            query = query.Where(a => a.Status == filters.Status);

        if (filters.Priority != null)
            query = query.Where(a => a.Priority == filters.Priority);

        if (filters.RegardingEntityType != null)
            query = query.Where(a => a.RegardingEntityType == filters.RegardingEntityType);

        if (filters.RegardingEntityId != null)
            query = query.Where(a => a.RegardingEntityId == filters.RegardingEntityId);

        if (filters.DueDateFrom != null)
            query = query.Where(a => a.DueDate >= filters.DueDateFrom);

        if (filters.DueDateTo != null)
            query = query.Where(a => a.DueDate <= filters.DueDateTo);

        if (filters.OwnerId != null)
            query = query.Where(a => a.OwnerId == filters.OwnerId);

        if (filters.IsActive != null)
            query = query.Where(a => a.IsActive == filters.IsActive);

        return query;
    }

    private static ActivityBaseModal MapToModal(ActivityProjection p)
    {
        var modal = new ActivityBaseModal(p.ActivityType)
        {
            Id = p.Id,
            Subject = p.Subject,
            Status = p.Status,
            Priority = p.Priority,
            StartDate = p.StartDate,
            EndDate = p.EndDate,
            DueDate = p.DueDate,
            IsActive = p.IsActive,
            Owner = new EntityReference(EntityType.User) { Id = p.OwnerId }
        };

        if (p.RegardingEntityType != null && p.RegardingEntityId != null)
        {
            modal.RegardingEntity = new EntityReference(p.RegardingEntityType.Value)
            {
                Id = p.RegardingEntityId.Value
            };
        }

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
        public Guid OwnerId { get; set; }
        public EntityType? RegardingEntityType { get; set; }
        public Guid? RegardingEntityId { get; set; }
    }

    #endregion
}