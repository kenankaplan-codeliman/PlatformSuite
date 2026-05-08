using Platform.Application.Modals;
using Platform.Domain.Entities.Identities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Platform.Application.Interfaces
{
    public interface ISessionService
    {
        Task<AuthenticationToken> CreateSessionAsync(User user, ClientInfo? clientInfo = null);
        Task<AuthenticationToken> RefreshSessionAsync(string refreshToken, ClientInfo? clientInfo);
        Task RevokeSessionAsync(string accessToken, ClientInfo? clientInfo);

        IContextUser? GetSessionUser(string accessToken);


        Task RevokeAllUserSessionsAsync(Guid userId);
        
        Task<List<SessionInfo>> GetUserActiveSessionsAsync(Guid userId);
    }
}
