using CRM.Application.Modals;
using CRM.Domain.Entities.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Interfaces
{
    public interface ISessionService
    {
        AuthenticationToken CreateSession(AppUser user, ClientInfo? clientInfo = null);
        AuthenticationToken RefreshSession(string refreshToken, ClientInfo? clientInfo);
        void RevokeSessionAsync(string accessToken, ClientInfo? clientInfo);

        IContextUser? GetSessionUser(string accessToken);

        
        void RevokeAllUserSessions(Guid userId);
        List<SessionInfo> GetUserActiveSessions(Guid userId);
    }
}
