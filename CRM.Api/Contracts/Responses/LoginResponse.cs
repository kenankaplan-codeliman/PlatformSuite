using CRM.Api.Contracts.Dto;
using CRM.Application.Models;
using CRM.Domain.Entities.Identity;

namespace CRM.Api.Contracts.Responses;

public class LoginResponse
{
    public required string AccessToken { get; set; } = null!;
    public required DateTime AccessTokenExpireAt { get; set; }
    public string? RefreshToken { get; set; } = null!;
    public DateTime? RefreshTokenExpireAt { get; set; }
    public required UserDto User { get; set; }

    public static LoginResponse fromAuthToken(AuthenticationToken authenticationToken, AppUser user, AppOrganization? organization)
    {
        return new LoginResponse()
        {
            AccessToken = authenticationToken.AccessToken,
            AccessTokenExpireAt = authenticationToken.AccessTokenExpiration,
            RefreshToken = authenticationToken.RefreshToken,
            RefreshTokenExpireAt = authenticationToken.RefreshTokenExpiration,
            User = new UserDto()
            {
                Id = user.Id,
                Email = user.Email,
                DisplayName = $"{user.FirstName} {user.LastName}",
                OrganizationId = organization?.Id,
                OrganizationName = $"({organization?.OrganizationCode}) {organization?.OrganizationName}"
                
            }
        };
    }
}
