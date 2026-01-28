using CRM.Application.Authentication.Interfaces;
using CRM.Application.Modals;
using CRM.Domain.Entities.Identity;

namespace CRM.Application.Interfaces;

public interface ITokenService
{
    AuthenticationToken GenerateToken(AppUser user, DateTime accessTokenExpiration, DateTime? refreshTokenExpiration= null, string? refreshToken= null);
    ICurrentUserContext ValidateAccessToken(string accessToken);
}
