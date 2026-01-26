using CRM.Application.Interfaces;

namespace CRM.Application.Models;

public class AuthenticationToken
{
    public required string AccessToken { get; init; }
    public required string AccessTokenId { get; init; }
    public required DateTime AccessTokenExpiration { get; init; }
    public required string? RefreshToken { get; init; }
    public required DateTime? RefreshTokenExpiration { get; init; }

    public static AuthenticationToken Ok(string accessToken, string accessTokenId, DateTime accessTokenExpiration, string? refreshToken, DateTime? refreshTokenExpiration)
        => new()
        {
            AccessToken = accessToken,
            AccessTokenId = accessTokenId,
            RefreshToken = refreshToken,
            RefreshTokenExpiration = refreshTokenExpiration,
            AccessTokenExpiration = accessTokenExpiration,
        };
}
