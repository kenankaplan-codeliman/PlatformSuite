
using CRM.Application.Modals;
using CRM.Domain.Entities.Identities;

namespace CRM.Application.Interfaces;

public interface IAppLoginRepository : IEntityRepository<AppLogin>
{
    Task<AppLogin?> GetByAccessTokenAsync(string accessTokenId, CancellationToken cancellationToken = default);
    Task<AppLogin?> GetByRefreshTokenAsync(string refreshTokenId, CancellationToken cancellationToken = default);

    Task<List<SessionInfo>> GetUserActiveSessionsAsync(Guid userId, CancellationToken cancellationToken = default);
}
