using CRM.Application.Authentication.Interfaces;
using CRM.Application.Models;
using CRM.Domain.Entities.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Interfaces
{
    public interface ISessionService
    {
        Task<Guid> CreateSessionAsync(AppUser user, AuthenticationToken authenticationToken, ClientInfo? clientInfo = null);
        Task<Guid> RefreshSessionAsync(AppUser user, AuthenticationToken authenticationToken, ClientInfo? clientInfo = null);
        Task<bool> IsSessionValidAsync(string accessTokenId);
        Task<ICurrentUserContext?> GetSessionValue(string accessTokenId);

        Task RevokeSessionAsync(AppUser user, string accessTokenId);
        Task RevokeAllUserSessionsAsync(Guid userId);
        Task<List<SessionInfo>> GetUserActiveSessionsAsync(Guid userId);
    }
}
