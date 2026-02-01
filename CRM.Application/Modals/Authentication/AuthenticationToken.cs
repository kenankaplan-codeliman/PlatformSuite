using CRM.Application.Interfaces;

namespace CRM.Application.Modals;

public class AuthenticationToken
{
    public required string AccessToken { get; init; }
    public required DateTime AccessTokenExpiration { get; init; }
    public required string RefreshToken { get; init; }
    public required DateTime RefreshTokenExpiration { get; init; }

    public static AuthenticationToken Create(string accessToken, DateTime accessTokenExpiration, string refreshToken, DateTime refreshTokenExpiration)
        => new()
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            RefreshTokenExpiration = refreshTokenExpiration,
            AccessTokenExpiration = accessTokenExpiration,
        };
}
