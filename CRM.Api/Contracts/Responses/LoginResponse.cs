using CRM.Application.Modals;

namespace CRM.Api.Contracts.Responses;

public class LoginResponse
{
    public required string AccessToken { get; set; } = null!;
    public required DateTime AccessTokenExpireAt { get; set; }
    public string RefreshToken { get; set; } = null!;
    public DateTime RefreshTokenExpireAt { get; set; }

    public static LoginResponse fromAuthToken(AuthenticationToken authenticationToken)
    {
        return new LoginResponse()
        {
            AccessToken = authenticationToken.AccessToken,
            AccessTokenExpireAt = authenticationToken.AccessTokenExpiration,
            RefreshToken = authenticationToken.RefreshToken,
            RefreshTokenExpireAt = authenticationToken.RefreshTokenExpiration,
        };
    }
}
