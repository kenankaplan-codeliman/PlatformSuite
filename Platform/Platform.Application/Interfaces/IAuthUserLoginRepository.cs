
using Platform.Application.Modals;
using Platform.Domain.Entities.Identities;

namespace Platform.Application.Interfaces;

public interface IAuthUserLoginRepository : IEntityRepository<AuthUserLogin>
{
    Task<AuthUserLogin?> GetByAccessTokenAsync(string accessTokenId, CancellationToken cancellationToken = default);
    Task<AuthUserLogin?> GetByRefreshTokenAsync(string refreshTokenId, CancellationToken cancellationToken = default);

    Task<List<SessionInfo>> GetUserActiveSessionsAsync(Guid userId, CancellationToken cancellationToken = default);
}
