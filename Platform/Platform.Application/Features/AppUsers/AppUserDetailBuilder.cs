using Platform.Application.Common.Abstractions;
using Platform.Application.Features.AppUsers.Dtos;
using Platform.Application.Modals.Common;
using Microsoft.EntityFrameworkCore;

namespace Platform.Application.Features.AppUsers;

internal static class AppUserDetailBuilder
{
    public static async Task<AppUserDetailItem?> BuildAsync(IApplicationDbContext db, Guid id, CancellationToken cancellationToken)
    {
        var detail = await (
            from u in db.AuthUser.AsNoTracking()
            where u.Id == id
            let org = db.AuthOrganization.Where(o => o.Id == u.OrganizationId)
                .Select(o => new { o.Id, o.OrganizationName, o.Title })
                .FirstOrDefault()
            let mgr = u.ManagerId.HasValue
                ? db.AuthUser.Where(m => m.Id == u.ManagerId)
                    .Select(m => new { m.Id, m.FirstName, m.LastName, m.Email })
                    .FirstOrDefault()
                : null
            select new AppUserDetailItem
            {
                Id = u.Id,
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName,
                PhoneNumber = u.PhoneNumber,
                Organization = org == null ? null : new EntityReference("Organization")
                {
                    Id = org.Id,
                    Name = org.Title ?? org.OrganizationName,
                },
                Manager = mgr == null ? null : new EntityReference("User")
                {
                    Id = mgr.Id,
                    Name = mgr.FirstName + " " + mgr.LastName,
                    Email = mgr.Email,
                },
                IsActive = u.IsActive,
                CreatedAt = u.CreatedAt,
                UpdatedAt = u.UpdatedAt,
            }).FirstOrDefaultAsync(cancellationToken);

        if (detail is null) return null;

        detail.Roles = await (
            from ur in db.AuthUserRole.AsNoTracking()
            join r in db.AuthRole.AsNoTracking() on ur.RoleId equals r.Id
            where ur.UserId == id && ur.IsActive
            orderby r.RoleName
            select new EntityReference("AppRole")
            {
                Id = r.Id,
                Name = r.RoleName,
            }).ToListAsync(cancellationToken);

        return detail;
    }
}
