using Platform.Application.Exceptions;
using Platform.Application.Interfaces;
using Platform.Application.Modals;
using Platform.Domain.Entities.Identities;
using Platform.Domain.Enums;
using Platform.Infrastructure.Data;
using Platform.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Runtime.CompilerServices;


namespace Platform.Infrastructure.Services;

public class SessionService : ISessionService
{
    private readonly IConfiguration config;
    private readonly ICacheService cache;
    private readonly IAuthUserRepository userRepository;
    private readonly IAuthOrganizationRepository organizationRepository;
    private readonly ITokenService tokenService;
    private readonly IAuthUserLoginRepository appLoginRepository;

    private const string SESSION_PREFIX = "session:";

    public SessionService(
        IConfiguration config,
        ICacheService cache,
        IAuthUserRepository userRepository,
        IAuthOrganizationRepository organizationRepository,
        IAuthRoleRepository roleRepository,
        ITokenService tokenService,
        IAuthUserLoginRepository appLoginRepository)
    {
        this.config = config;
        this.cache = cache;
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.tokenService = tokenService;
        this.appLoginRepository = appLoginRepository;
    }

    public async Task<AuthenticationToken> CreateSessionAsync(AuthUser user, ClientInfo? clientInfo = null)
    {
        string accessTokenId = generateTokenId();
        DateTime accessTokenExp = getAccessTokenExpire();

        var accessToken = tokenService.GenerateToken(accessTokenId, accessTokenExp);

        string refreshTokenId = generateTokenId();
        DateTime refreshTokenExp = getRefreshTokenExpire();

        var refreshToken = tokenService.GenerateToken(refreshTokenId, refreshTokenExp);


        // LoginHistory'ye kaydet
        var loginHistory = new AuthUserLogin
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
        };

        await appLoginRepository.CreateAsync(loginHistory);


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


        var appLogin = await appLoginRepository.GetByRefreshTokenAsync(refreshTokenId);

        if (appLogin == null)
            throw new UnAuthenticatedException("User Login not found.");

        if (appLogin.RefreshTokenExpiresAt <= DateTime.Now)
            throw new UnAuthenticatedException("Refresh token expired.");


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

        await appLoginRepository.UpdateAsync(appLogin);

        var authenticationToken = AuthenticationToken.Create(newAccessToken, newAccessTokenExp, refreshToken, appLogin.RefreshTokenExpiresAt);

        return authenticationToken;
    }

    public async Task RevokeSessionAsync(string accessToken, ClientInfo? clientInfo)
    {
        string accessTokenId = tokenService.ValidateAccessToken(accessToken, false);

        RemoveSessionUser(accessTokenId);

        var appLogin = await appLoginRepository.GetByAccessTokenAsync(accessTokenId);

        if (appLogin != null)
        {
            await appLoginRepository.SetStateAsync(new[] { appLogin.Id }, false);
        }
    }

    public IContextUser? GetSessionUser(string accessTokenId)
    {
        var cacheKey = generateKey(accessTokenId);
        return cache.Get<IContextUser>(cacheKey);
    }
    public async Task<List<SessionInfo>> GetUserActiveSessionsAsync(Guid userId)
    {

        var sessions = await appLoginRepository.GetUserActiveSessionsAsync(userId);

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
        List<SessionInfo> sessions = await GetUserActiveSessionsAsync(userId);

        var sessionKeys = sessions.Select(session => generateKey(session.AccessTokenId)).ToList();

        var sessionIds = sessions.Select(session => session.LoginHistoryId).ToList();

        foreach (var sessionkey in sessionKeys)
        {
            cache.Remove(sessionkey);
        }

        await appLoginRepository.SetStateAsync(sessionIds, false);
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
