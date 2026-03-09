using CRM.Application.Modals;
using CRM.Domain.Entities.Identities;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Interfaces
{
    public interface ISessionService
    {
        Task<AuthenticationToken> CreateSessionAsync(AppUser user, ClientInfo? clientInfo = null);
        Task<AuthenticationToken> RefreshSessionAsync(string refreshToken, ClientInfo? clientInfo);
        Task RevokeSessionAsync(string accessToken, ClientInfo? clientInfo);

        IContextUser? GetSessionUser(string accessToken);


        Task RevokeAllUserSessionsAsync(Guid userId);
        
        Task<List<SessionInfo>> GetUserActiveSessionsAsync(Guid userId);
    }
}
