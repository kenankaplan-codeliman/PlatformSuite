using CRM.Application.Authentication.Interfaces;
using CRM.Application.Modals;
using CRM.Domain.Entities.Identity;

namespace CRM.Application.Interfaces;

public interface ITokenService
{
    string GenerateToken(string accessTokenId, DateTime accessTokenExpiration);
    string ValidateAccessToken(string accessToken, bool validateLifetime = true);
}
