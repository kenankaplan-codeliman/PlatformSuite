using Platform.Application.Interfaces;
using Platform.Domain.Entities.Preferences;
using Platform.Infrastructure.Data;
using Platform.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Platform.Infrastructure.Repositories;

public class UserPreferenceRepository
    : BaseEntityRepository<UserPreference>, IUserPreferenceRepository
{
    public UserPreferenceRepository(PlatformDbContext dbContext) : base(dbContext)
    {
    }

    public override async Task<UserPreference?> GetAsync(Guid id, CancellationToken cancellationToken = default)
        => await dbSet.FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

    // Org/All erişimli kullanıcılar için global owner filtresi yetmez; OwnerId explicit filtrelenir.
    public async Task<UserPreference?> GetForCurrentUserAsync(string preferenceKey, CancellationToken cancellationToken = default)
        => await dbSet.FirstOrDefaultAsync(
            p => p.OwnerId == dbContext.CurrentUserId && p.PreferenceKey == preferenceKey,
            cancellationToken);
}
