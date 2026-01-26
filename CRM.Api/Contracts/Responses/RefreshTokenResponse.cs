using CRM.Application.Models;

namespace CRM.Api.Contracts.Responses
{
    public class RefreshTokenResponse
    {
        public string AccessToken { get; set; } = null!;
        public DateTime AccessTokenExpireAt { get; set; }
        public static RefreshTokenResponse fromAuthToken(AuthenticationToken authenticationToken)
        {
            return new RefreshTokenResponse()
            {
                AccessToken = authenticationToken.AccessToken,
                AccessTokenExpireAt = authenticationToken.AccessTokenExpiration
            };
        }
    }
}
