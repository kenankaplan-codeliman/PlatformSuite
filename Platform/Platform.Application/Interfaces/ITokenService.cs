using Platform.Application.Modals;
using Platform.Domain.Entities.Identities;

namespace Platform.Application.Interfaces;

public interface ITokenService
{
    string GenerateToken(string accessTokenId, DateTime accessTokenExpiration);
    string ValidateAccessToken(string accessToken, bool validateLifetime = true);
}
