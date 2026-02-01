using CRM.Application.Authentication.Interfaces;
using CRM.Application.Modals;
using CRM.Domain.Entities.Identity;
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

        Task<ICurrentUserContext?> GetSessionUser(string accessToken);

        
        Task RevokeAllUserSessionsAsync(Guid userId);
        Task<List<SessionInfo>> GetUserActiveSessionsAsync(Guid userId);
    }
}
