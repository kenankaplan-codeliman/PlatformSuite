
using Platform.Application.Modals;
using Platform.Domain.Entities.Identities;

namespace Platform.Application.Interfaces;

public interface IAppLoginRepository : IEntityRepository<AppLogin>
{
    Task<AppLogin?> GetByAccessTokenAsync(string accessTokenId, CancellationToken cancellationToken = default);
    Task<AppLogin?> GetByRefreshTokenAsync(string refreshTokenId, CancellationToken cancellationToken = default);

    Task<List<SessionInfo>> GetUserActiveSessionsAsync(Guid userId, CancellationToken cancellationToken = default);
}
