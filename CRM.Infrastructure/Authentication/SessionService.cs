using Azure.Core;
using CRM.Application.Authentication.Interfaces;
using CRM.Application.Exceptions;
using CRM.Application.Interfaces;
using CRM.Application.Modals;
using CRM.Domain.Entities.Identity;
using CRM.Domain.Enums;
using CRM.Infrastructure.Data;
using CRM.Infrastructure.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;


namespace CRM.Infrastructure.Authentication
{
    public class SessionService : ISessionService
    {
        private readonly IConfiguration config;
        private readonly ICacheService cache;
        private readonly IUserRepository userRepository;
        private readonly IOrganizationRepository organizationRepository;
        private readonly IRoleRepository roleRepository;
        private readonly ITokenService tokenService;
        private readonly IUnitOfWork unitOfWork;
        private readonly DatabaseContext dbContext;
        private const string SESSION_PREFIX = "session:";



        public SessionService(
            IConfiguration config,
            ICacheService cache,
            IUserRepository userRepository,
            IOrganizationRepository organizationRepository,
            IRoleRepository roleRepository,
            ITokenService tokenService,
            IUnitOfWork unitOfWork,
            DatabaseContext dbContext)
        {
            this.config = config;
            this.cache = cache;
            this.userRepository = userRepository;
            this.organizationRepository = organizationRepository;
            this.roleRepository = roleRepository;
            this.tokenService = tokenService;
            this.unitOfWork = unitOfWork;
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

            var authenticationToken = AuthenticationToken.Create(accessToken, accessTokenExp, refreshToken, refreshTokenExp);

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

            var orgIds = await organizationRepository.GetOrganizationHierarchy(user.OrganizationId);

            var currentUserContext = new CurrentUserContext()
            {
                UserId = user.Id,
                Email = user.Email,
                DisplayName = $"{user.FirstName} {user.LastName}",
                OrganizationId = user.OrganizationId,
                AccessLevel = AccessLevel.None,
                AccessibleOrganizationList = orgIds
            };

            await SetSessionUser(accessTokenId, currentUserContext, authenticationToken.RefreshTokenExpiration);

            return authenticationToken;

        }

        public async Task<AuthenticationToken> RefreshSessionAsync(string refreshToken, ClientInfo? clientInfo)
        {

            string refreshTokenId = tokenService.ValidateAccessToken(refreshToken);


            var appLogin = await dbContext.AppLogin.FirstOrDefaultAsync(lh => lh.RefreshTokenId == refreshTokenId && lh.IsActive);

            if (appLogin == null)
                throw new UnAuthenticatedException("User Login not fount.");


            //Generate New Token
            string newAccessTokenId = generateTokenId();
            DateTime accessTokenExp = getAccessTokenExpire();

            var accessToken = tokenService.GenerateToken(newAccessTokenId, accessTokenExp);

            //Renew Session Value

            ICurrentUserContext? currentUserContext = await GetSessionUser(appLogin.AccessTokenId);

            if (currentUserContext is CurrentUserContext user)
            {
                await SetSessionUser(newAccessTokenId, user, appLogin.RefreshTokenExpiresAt);
                await RemoveSessionUser(appLogin.AccessTokenId);
            }
            else
            {
                throw new UnAuthenticatedException("Session user not fount.");
            }

            //Update History with new Token
            appLogin.AccessTokenId = newAccessTokenId;
            appLogin.AccessTokenExpiresAt = accessTokenExp;
            appLogin.RefreshCount++;
            appLogin.IpAddress = clientInfo?.IpAddress;
            appLogin.UserAgent = clientInfo?.UserAgent;

            dbContext.AppLogin.Update(appLogin);

            var authenticationToken = AuthenticationToken.Create(accessToken, accessTokenExp, refreshToken, appLogin.RefreshTokenExpiresAt);

            return authenticationToken;
        }

        public async Task RevokeSessionAsync(string accessToken, ClientInfo? clientInfo)
        {
            string accessTokenId = tokenService.ValidateAccessToken(accessToken, false);

            await RemoveSessionUser(accessTokenId);

            var appLogin = await dbContext.AppLogin.FirstOrDefaultAsync(lh => lh.AccessTokenId == accessTokenId && lh.IsActive);

            if (appLogin != null)
            {
                appLogin.IsActive = false;
                appLogin.LogoutDate = DateTime.UtcNow;
                dbContext.AppLogin.Update(appLogin);
            }
        }

        public async Task<List<SessionInfo>> GetUserActiveSessionsAsync(Guid userId)
        {

            // DB'den kullanıcının tüm aktif session'larını al
            var sessions = await dbContext.AppLogin
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
                   .ToListAsync();

            return sessions;
        }

        public async Task<ICurrentUserContext?> GetSessionUser(string accessTokenId)
        {
            var cacheKey = generateKey(accessTokenId);
            return await cache.GetAsync<CurrentUserContext>(cacheKey);
        }

        private async Task SetSessionUser(string accessTokenId, CurrentUserContext currentUserContext, DateTime expiration)
        {
            var cacheKey = generateKey(accessTokenId);
            await cache.SetAsync(cacheKey, currentUserContext, expiration);
        }

        private async Task RemoveSessionUser(string accessTokenId)
        {
            var cacheKey = generateKey(accessTokenId);
            await cache.RemoveAsync(cacheKey);
        }


        public async Task RevokeAllUserSessionsAsync(Guid userId)
        {
            List<SessionInfo> sessions = await GetUserActiveSessionsAsync(userId);

            var cacheKeys = sessions.Select(session => generateKey(session.AccessTokenId)).ToList();
            await cache.RemoveAsync(cacheKeys);

            // DB update
            await dbContext.AppLogin
                .Where(lh => lh.UserId == userId && lh.IsActive)
                .ExecuteUpdateAsync(s => s
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
