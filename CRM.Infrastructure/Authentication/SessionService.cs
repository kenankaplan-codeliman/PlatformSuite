using CRM.Application.Exceptions;
using CRM.Application.Interfaces;
using CRM.Application.Modals;
using CRM.Domain.Entities.Identities;
using CRM.Domain.Enums;
using CRM.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Runtime.CompilerServices;


namespace CRM.Infrastructure.Authentication
{
    public class SessionService : ISessionService
    {
        private readonly IConfiguration config;
        private readonly ICacheService cache;
        private readonly IUserRepository userRepository;
        private readonly IOrganizationRepository organizationRepository;
        private readonly ITokenService tokenService;
        private readonly DatabaseContext dbContext;
        private const string SESSION_PREFIX = "session:";

        public SessionService(
            IConfiguration config,
            ICacheService cache,
            IUserRepository userRepository,
            IOrganizationRepository organizationRepository,
            IRoleRepository roleRepository,
            ITokenService tokenService,
            DatabaseContext dbContext)
        {
            this.config = config;
            this.cache = cache;
            this.userRepository = userRepository;
            this.organizationRepository = organizationRepository;
            this.tokenService = tokenService;
            this.dbContext = dbContext;
        }

        public async Task<AuthenticationToken> CreateSessionAsync(AppUser user, ClientInfo? clientInfo = null)
        {
            string accessTokenId = generateTokenId();
            DateTime accessTokenExp = getAccessTokenExpire();

            var accessToken = tokenService.GenerateToken(accessTokenId, accessTokenExp);

            string refreshTokenId = generateTokenId();
            DateTime refreshTokenExp = getRefreshTokenExpire();

            var refreshToken = tokenService.GenerateToken(refreshTokenId, refreshTokenExp);


            // LoginHistory'ye kaydet
            var loginHistory = new AppLogin
            {
                UserId = user.Id,
                LoginDate = DateTime.UtcNow,
                AccessTokenId = accessTokenId,
                AccessTokenExpiresAt = accessTokenExp,
                RefreshTokenId = refreshTokenId,
                RefreshTokenExpiresAt = refreshTokenExp,
                RefreshCount = 0,
                IpAddress = clientInfo?.IpAddress,
                UserAgent = clientInfo?.UserAgent,
                IsActive = true
            };


            dbContext.AppLogin.Add(loginHistory);
            await dbContext.SaveChangesAsync();

            var orgMap = await organizationRepository.GetOrganizationHierarchyAsync(user.OrganizationId);
            var usrPrivileges = await userRepository.GetUserPrivilegesAsync(user.Id);
            
            var contextUser = new ContextUser()
            {
                UserId = user.Id,
                Email = user.Email,
                DisplayName = user.FullName,
                OrganizationId = user.OrganizationId,
                OrganizationName = orgMap[user.OrganizationId],
                AccessibleOrganizationList = orgMap.Keys.ToList(),
                PrivilegesCodes = usrPrivileges
            };

            var authenticationToken = AuthenticationToken.Create(accessToken, accessTokenExp, refreshToken, refreshTokenExp);

            SetSessionUser(accessTokenId, contextUser, authenticationToken.RefreshTokenExpiration);


            return authenticationToken;
        }

        public async Task<AuthenticationToken> RefreshSessionAsync(string refreshToken, ClientInfo? clientInfo)
        {

            string refreshTokenId = tokenService.ValidateAccessToken(refreshToken);


            var appLogin = dbContext.AppLogin.FirstOrDefault(lh => lh.RefreshTokenId == refreshTokenId && lh.IsActive);

            if (appLogin == null)
                throw new UnAuthenticatedException("User Login not fount.");


            //Remove Old Session 
            RemoveSessionUser(appLogin.AccessTokenId);

            //New Token
            string newAccessTokenId = generateTokenId();
            DateTime newAccessTokenExp = getAccessTokenExpire();
            var newAccessToken = tokenService.GenerateToken(newAccessTokenId, newAccessTokenExp);


            //New Context User
            var user = await userRepository.GetAsync(appLogin.UserId) ?? throw new NotFoundException();
            var orgMap = await organizationRepository.GetOrganizationHierarchyAsync(user.OrganizationId);
            var usrPrivileges = await userRepository.GetUserPrivilegesAsync(user.Id);

            var newContextUser = new ContextUser()
            {
                UserId = user.Id,
                Email = user.Email,
                DisplayName = user.FullName,
                OrganizationId = user.OrganizationId,
                OrganizationName = orgMap[user.OrganizationId],
                AccessibleOrganizationList = orgMap.Keys.ToList(),
                PrivilegesCodes = usrPrivileges
            };

            SetSessionUser(newAccessTokenId, newContextUser, appLogin.RefreshTokenExpiresAt);

            //Update History with new Token
            appLogin.AccessTokenId = newAccessTokenId;
            appLogin.AccessTokenExpiresAt = newAccessTokenExp;
            appLogin.RefreshCount++;
            appLogin.IpAddress = clientInfo?.IpAddress;
            appLogin.UserAgent = clientInfo?.UserAgent;

            dbContext.AppLogin.Update(appLogin);
            await dbContext.SaveChangesAsync();

            var authenticationToken = AuthenticationToken.Create(newAccessToken, newAccessTokenExp, refreshToken, appLogin.RefreshTokenExpiresAt);

            return authenticationToken;
        }

        public async Task RevokeSessionAsync(string accessToken, ClientInfo? clientInfo)
        {
            string accessTokenId = tokenService.ValidateAccessToken(accessToken, false);

            RemoveSessionUser(accessTokenId);

            var appLogin = dbContext.AppLogin.FirstOrDefault(lh => lh.AccessTokenId == accessTokenId && lh.IsActive);

            if (appLogin != null)
            {
                appLogin.IsActive = false;
                appLogin.LogoutDate = DateTime.UtcNow;
                dbContext.AppLogin.Update(appLogin);
                await dbContext.SaveChangesAsync();
            }
            
        }

        public IContextUser? GetSessionUser(string accessTokenId)
        {
            var cacheKey = generateKey(accessTokenId);
            return cache.Get<IContextUser>(cacheKey);
        }
        public List<SessionInfo> GetUserActiveSessions(Guid userId)
        {

            // DB'den kullanıcının tüm aktif session'larını al
            var sessions = dbContext.AppLogin.AsNoTracking()
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
                   .ToList();

            return sessions;
        }



        private void SetSessionUser(string accessTokenId, IContextUser currentUserContext, DateTime expiration)
        {
            var cacheKey = generateKey(accessTokenId);
            cache.Set(cacheKey, currentUserContext, expiration);
        }

        private void RemoveSessionUser(string accessTokenId)
        {
            var cacheKey = generateKey(accessTokenId);
            cache.Remove(cacheKey);
        }

        public async Task RevokeAllUserSessionsAsync(Guid userId)
        {
            List<SessionInfo> sessions = GetUserActiveSessions(userId);

            var sessionKeys = sessions.Select(session => generateKey(session.AccessTokenId)).ToList();

            foreach (var sessionkey in sessionKeys)
            {
                cache.Remove(sessionkey);
            }

            // DB update
            dbContext.AppLogin
                .Where(lh => lh.UserId == userId && lh.IsActive)
                .ExecuteUpdate(s => s
                    .SetProperty(lh => lh.IsActive, false)
                    .SetProperty(lh => lh.LogoutDate, DateTime.UtcNow));
        }

        private string generateKey(string accessTokenId)
        {
            return $"{SESSION_PREFIX}{accessTokenId}";
        }

        private string generateTokenId()
        {
            return Guid.NewGuid().ToString("N");
        }

        private DateTime getRefreshTokenExpire()
        {
            return DateTime.Now.AddMinutes(int.Parse(config["Jwt:RefreshExpireMin"]!));
        }

        private DateTime getAccessTokenExpire()
        {
            return DateTime.Now.AddMinutes(int.Parse(config["Jwt:AccessExpireMin"]!));
        }

        
    }
}
