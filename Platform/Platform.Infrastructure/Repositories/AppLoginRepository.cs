
using Azure.Core;
using Platform.Application.Interfaces;
using Platform.Application.Modals;
using Platform.Domain.Entities.Common;
using Platform.Domain.Entities.Identities;
using Platform.Infrastructure.Data;
using Platform.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Platform.Infrastructure.Repositories;

public class AppLoginRepository : BaseEntityRepository<AppLogin>, IAppLoginRepository
{
    public AppLoginRepository(PlatformDbContext dbContext) : base(dbContext)
    {
    }

    public override async Task<AppLogin?> GetAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await dbContext.AppLogin.FirstOrDefaultAsync(o => o.Id == id, cancellationToken);
    }

    public async Task<AppLogin?> GetByAccessTokenAsync(string accessTokenId, CancellationToken cancellationToken = default)
    {
        return await dbContext.AppLogin.FirstOrDefaultAsync(lh => lh.AccessTokenId == accessTokenId && lh.IsActive, cancellationToken);
    }

    public async Task<AppLogin?> GetByRefreshTokenAsync(string refreshTokenId, CancellationToken cancellationToken = default)
    {
        return await dbContext.AppLogin.FirstOrDefaultAsync(lh => lh.RefreshTokenId == refreshTokenId && lh.IsActive, cancellationToken);
    }

    public async Task<List<SessionInfo>> GetUserActiveSessionsAsync(Guid userId, CancellationToken cancellationToken = default) 
    {
       return await dbContext.AppLogin.AsNoTracking()
                   .Where(lh => lh.UserId == userId && lh.IsActive)
                   .Select(lh => new SessionInfo()
                   {
                       LoginHistoryId = lh.Id,
                       AccessTokenId = lh.AccessTokenId,
                       LoginDate = lh.LoginDate,
                       AccessTokenExpiresAt = lh.AccessTokenExpiresAt,
                       RefreshTokenId = lh.RefreshTokenId,
                       RefreshTokenExpiresAt = lh.RefreshTokenExpiresAt

                   })
                   .ToListAsync(cancellationToken);
    }


    public override async Task SetStateAsync(IEnumerable<Guid> entityIds, bool isActive, CancellationToken cancellationToken = default)
    {
        var query = dbSet.Where(e => entityIds.Contains(e.Id));
        
        query = WithOwnerFilter(query);

        var updated = await query.ExecuteUpdateAsync(
            s => s
                .SetProperty(e => EF.Property<bool>(e, nameof(AppLogin.IsActive)), isActive)
                .SetProperty(e => EF.Property<DateTime>(e, nameof(AppLogin.LogoutDate)), DateTime.UtcNow),
            cancellationToken);

        if (updated == 0)
            throw new KeyNotFoundException(
                $"{typeof(AppLogin).Name} not found");
    }
}
