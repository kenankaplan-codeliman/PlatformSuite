using CRM.Application.Modals;
using CRM.Domain.Entities.Identities;

namespace CRM.Application.Interfaces;

public interface ITokenService
{
    string GenerateToken(string accessTokenId, DateTime accessTokenExpiration);
    string ValidateAccessToken(string accessToken, bool validateLifetime = true);
}
