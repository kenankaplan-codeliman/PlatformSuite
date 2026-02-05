using CRM.Application.Exceptions;
using CRM.Application.Interfaces;
using CRM.Application.Modals;
using CRM.Domain.Entities.Identity;
using CRM.Domain.Enums;
using CRM.Infrastructure.Data;
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

        public AuthenticationToken CreateSession(AppUser user, ClientInfo? clientInfo = null)
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

            var orgMap = organizationRepository.GetOrganizationHierarchy(user.OrganizationId);
            var usrPrivileges = userRepository.GetPrivileges(user.Id);

            var userContext = new ContextUser()
            {
                UserId = user.Id,
                Email = user.Email,
                DisplayName = $"{user.FirstName} {user.LastName}",
                OrganizationId = user.OrganizationId,
                OrganizationName = orgMap[user.OrganizationId],
                AccessibleOrganizationList = orgMap.Keys.ToList(),
                PrivilegesCodes = usrPrivileges
            };

            SetSessionUser(accessTokenId, userContext, authenticationToken.RefreshTokenExpiration);

            return authenticationToken;

        }

        public AuthenticationToken RefreshSession(string refreshToken, ClientInfo? clientInfo)
        {

            string refreshTokenId = tokenService.ValidateAccessToken(refreshToken);


            var appLogin = dbContext.AppLogin.FirstOrDefault(lh => lh.RefreshTokenId == refreshTokenId && lh.IsActive);

            if (appLogin == null)
                throw new UnAuthenticatedException("User Login not fount.");


            //Generate New Token
            string newAccessTokenId = generateTokenId();
            DateTime accessTokenExp = getAccessTokenExpire();

            var accessToken = tokenService.GenerateToken(newAccessTokenId, accessTokenExp);

            //Renew Session Value

            IContextUser? currentUserContext = GetSessionUser(appLogin.AccessTokenId);

            if (currentUserContext is ContextUser user)
            {
                SetSessionUser(newAccessTokenId, user, appLogin.RefreshTokenExpiresAt);
                RemoveSessionUser(appLogin.AccessTokenId);
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

        public void RevokeSession(string accessToken, ClientInfo? clientInfo)
        {
            string accessTokenId = tokenService.ValidateAccessToken(accessToken, false);

            RemoveSessionUser(accessTokenId);

            var appLogin = dbContext.AppLogin.FirstOrDefault(lh => lh.AccessTokenId == accessTokenId && lh.IsActive);

            if (appLogin != null)
            {
                appLogin.IsActive = false;
                appLogin.LogoutDate = DateTime.UtcNow;
                dbContext.AppLogin.Update(appLogin);
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


        public void RevokeAllUserSessions(Guid userId)
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

        public void RevokeSessionAsync(string accessToken, ClientInfo? clientInfo)
        {
            throw new NotImplementedException();
        }
    }
}
