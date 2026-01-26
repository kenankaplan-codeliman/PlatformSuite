using Azure.Core;
using CRM.Application.Authentication.Interfaces;
using CRM.Application.Exceptions;
using CRM.Application.Interfaces;
using CRM.Application.Models;
using CRM.Domain.Entities.Identity;
using CRM.Domain.Enums;
using CRM.Infrastructure.Data;
using CRM.Infrastructure.Model;
using CRM.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;


namespace CRM.Infrastructure.Authentication
{
    public class SessionService : ISessionService
    {
        private readonly ICacheService cache;
        private readonly IOrganizationRepository organizationRepository;
        private readonly DatabaseContext dbContext;
        private const string SESSION_PREFIX = "session:";

        public SessionService(
            ICacheService cache,
            IOrganizationRepository organizationRepository,
            DatabaseContext dbContext)
        {
            this.cache = cache;
            this.dbContext = dbContext;
            this.organizationRepository = organizationRepository;
        }

        public async Task<Guid> CreateSessionAsync(
            AppUser user,
            AuthenticationToken authenticationToken,
            ClientInfo? clientInfo = null)
        {

            Guid sessionId = Guid.NewGuid();

            // LoginHistory'ye kaydet
            var loginHistory = new AppLoginHistory
            {
                Id = sessionId,
                UserId = user.Id,
                LoginDate = DateTime.UtcNow,
                AccessTokenId = authenticationToken.AccessTokenId,
                AccessTokenExpiresAt = authenticationToken.AccessTokenExpiration,
                RefreshToken = authenticationToken.RefreshToken ?? string.Empty,
                RefreshTokenExpiresAt = authenticationToken.RefreshTokenExpiration ?? DateTime.MinValue,
                RefreshCount = 0,
                IpAddress = clientInfo?.IpAddress,
                UserAgent = clientInfo?.UserAgent,
                IsActive = true
            };

            dbContext.AppLoginHistory.Add(loginHistory);
            await dbContext.SaveChangesAsync();

            var cacheKey = generateKey(authenticationToken.AccessTokenId);

            var orgIds = await organizationRepository.GetOrganizationHierarchy(user.OrganizationId);

            var currentUserContext = new CurrentUserContext()
            {
                UserId = user.Id,
                Email = user.Email,
                DisplayName = $"{user.FirstName} {user.LastName}",
                OrganizationId = user.OrganizationId,
                AccessTokenId = authenticationToken.AccessTokenId,
                AccessLevel = AccessLevel.None,
                AccessibleOrganizationList = orgIds
            };

            await cache.SetAsync(cacheKey, currentUserContext, authenticationToken.AccessTokenExpiration);

            return sessionId;
        }

        public async Task<bool> IsSessionValidAsync(string accessTokenId)
        {
            var cacheKey = generateKey(accessTokenId);
            return await cache.ExistsAsync(cacheKey);
        }

        public async Task<ICurrentUserContext?> GetSessionValue(string accessTokenId)
        {
            var cacheKey = generateKey(accessTokenId);
            return await cache.GetAsync<CurrentUserContext>(cacheKey);
        }

        public async Task<Guid> RefreshSessionAsync(AppUser user, AuthenticationToken authenticationToken, ClientInfo? clientInfo = null)
        {

            var loginHistory = await dbContext.AppLoginHistory.FirstOrDefaultAsync(lh => lh.UserId == user.Id && lh.RefreshToken == authenticationToken.RefreshToken && lh.IsActive);

            if (loginHistory == null)
                throw new BusinessException($"Login history not fount for User:{user.Id}");

            if (loginHistory.RefreshTokenExpiresAt < DateTime.Now)
                throw new UnAuthorizedException($"Refresh token expired.");

            //Old Session Remove
            var oldCacheKey = generateKey(loginHistory.AccessTokenId);
            await cache.RemoveAsync(oldCacheKey);

            //Update History with new Token
            loginHistory.AccessTokenId = authenticationToken.AccessTokenId;
            loginHistory.AccessTokenExpiresAt = authenticationToken.AccessTokenExpiration;
            loginHistory.RefreshCount++;
            loginHistory.IpAddress = clientInfo?.IpAddress;
            loginHistory.UserAgent = clientInfo?.UserAgent;

            await dbContext.SaveChangesAsync();

            var newCacheKey = generateKey(authenticationToken.AccessTokenId);
            await cache.SetAsync(newCacheKey, true, authenticationToken.AccessTokenExpiration);

            return loginHistory.Id;
        }

        public async Task RevokeSessionAsync(AppUser user, string accessTokenId)
        {
            var cacheKey = generateKey(accessTokenId);
            await cache.RemoveAsync(cacheKey);


            var loginHistory = await dbContext.AppLoginHistory.FirstOrDefaultAsync(lh => lh.UserId == user.Id && lh.AccessTokenId == accessTokenId && lh.IsActive);

            if (loginHistory != null)
            {
                loginHistory.IsActive = false;
                loginHistory.LogoutDate = DateTime.UtcNow;
                await dbContext.SaveChangesAsync();
            }
        }

        public async Task<List<SessionInfo>> GetUserActiveSessionsAsync(Guid userId)
        {

            // DB'den kullanıcının tüm aktif session'larını al
            var sessions = await dbContext.AppLoginHistory
                   .Where(lh => lh.UserId == userId && lh.IsActive)
                   .Select(lh => new SessionInfo()
                   {
                       LoginHistoryId = lh.Id,
                       AccessTokenId = lh.AccessTokenId,
                       LoginDate = lh.LoginDate,
                       AccessTokenExpiresAt = lh.AccessTokenExpiresAt,
                       RefreshToken = lh.RefreshToken,
                       RefreshTokenExpiresAt = lh.RefreshTokenExpiresAt

                   })
                   .ToListAsync();

            return sessions;
        }

        public async Task RevokeAllUserSessionsAsync(Guid userId)
        {
            List<SessionInfo> sessions = await GetUserActiveSessionsAsync(userId);

            var cacheKeys = sessions.Select(session => generateKey(session.AccessTokenId)).ToList();
            await cache.RemoveAsync(cacheKeys);

            // DB update
            await dbContext.AppLoginHistory
                .Where(lh => lh.UserId == userId && lh.IsActive)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(lh => lh.IsActive, false)
                    .SetProperty(lh => lh.LogoutDate, DateTime.UtcNow));
        }

        private string generateKey(string accessTokenId)
        {

            return $"{SESSION_PREFIX}{accessTokenId}";
        }


    }
}
