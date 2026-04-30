using Platform.Application.Common.Abstractions;
using Platform.Application.Features.AppUsers.Dtos;
using Microsoft.EntityFrameworkCore;

namespace Platform.Application.Features.AppUsers;

internal static class AppUserDetailBuilder
{
    public static async Task<AppUserDetailItem?> BuildAsync(IApplicationDbContext db, Guid id, CancellationToken cancellationToken)
    {
        var detail = await (
            from u in db.AppUser.AsNoTracking()
            where u.Id == id
            select new AppUserDetailItem
            {
                Id = u.Id,
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName,
                PhoneNumber = u.PhoneNumber,
                OrganizationId = u.OrganizationId,
                OrganizationName = db.AppOrganization.Where(o => o.Id == u.OrganizationId)
                    .Select(o => o.OrganizationName).FirstOrDefault(),
                ManagerId = u.ManagerId,
                ManagerName = u.ManagerId.HasValue
                    ? db.AppUser.Where(m => m.Id == u.ManagerId).Select(m => m.FirstName + " " + m.LastName).FirstOrDefault()
                    : null,
                IsActive = u.IsActive,
                CreatedAt = u.CreatedAt,
                UpdatedAt = u.UpdatedAt,
            }).FirstOrDefaultAsync(cancellationToken);

        if (detail is null) return null;

        detail.Roles = await (
            from ur in db.AppUserRole.AsNoTracking()
            join r in db.AppRole.AsNoTracking() on ur.RoleId equals r.Id
            where ur.UserId == id && ur.IsActive
            select new AppUserRoleItem
            {
                Id = r.Id,
                RoleName = r.RoleName,
                Description = r.Description,
            }).ToListAsync(cancellationToken);

        return detail;
    }
}
