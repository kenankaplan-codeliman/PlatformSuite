using Platform.Application.Common.Abstractions;
using Platform.Application.Features.AppRoles.Dtos;
using Microsoft.EntityFrameworkCore;

namespace Platform.Application.Features.AppRoles;

internal static class AppRoleDetailBuilder
{
    public static async Task<AppRoleDetailItem?> BuildAsync(IApplicationDbContext db, Guid id, CancellationToken cancellationToken)
    {
        var detail = await db.AuthRole.AsNoTracking()
            .Where(r => r.Id == id)
            .Select(r => new AppRoleDetailItem
            {
                Id = r.Id,
                RoleName = r.RoleName,
                Description = r.Description,
                IsDefault = r.IsDefault,
                IsActive = r.IsActive,
                CreatedAt = r.CreatedAt,
                UpdatedAt = r.UpdatedAt,
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (detail is null) return null;

        detail.Privileges = await db.AuthRolePrivilege.AsNoTracking()
            .Where(rp => rp.RoleId == id && rp.IsActive)
            .Select(rp => new AppRolePrivilegeItem
            {
                PrivilegeCode = rp.PrivilegeCode,
                AccessLevel = rp.AccessLevel.ToString(),
            })
            .ToListAsync(cancellationToken);

        return detail;
    }
}
