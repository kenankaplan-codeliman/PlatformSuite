using CRM.Application.Authentication.Interfaces;
using CRM.Application.Exceptions;
using CRM.Application.Interfaces;
using CRM.Application.Models;
using CRM.Domain.Entities.Identity;
using CRM.Domain.Enums;
using CRM.Infrastructure.Model;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.IdentityModel.Tokens.Experimental;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


namespace CRM.Infrastructure.Authentication;

public class JwtTokenService : ITokenService
{
    private readonly IConfiguration _config;

    public sealed class TokenKeys
    {
        public readonly static string sub = "sub";
        public readonly static string name = "name";
        public readonly static string userId = "userId";
        public readonly static string organizationId = "organizationId";
        public readonly static string accessTokenId = "accessTokenId";
    }
    public JwtTokenService(IConfiguration config)
    {
        _config = config;
    }
    
    public AuthenticationToken GenerateToken(AppUser user, DateTime accessTokenExpiration, DateTime? refreshTokenExpiration=null, string? refreshToken = null)
    {
        var accessTokenId = Guid.NewGuid().ToString("N");

        var claims = new List<Claim>
        {
            new Claim(TokenKeys.sub, accessTokenId)
            //new Claim(TokenKeys.sub, user.Email),
            //new Claim(TokenKeys.name, $"{user.FirstName} {user.LastName}"),
            //new Claim(TokenKeys.userId, user.Id.ToString("N")),
            //new Claim(TokenKeys.organizationId, user.OrganizationId.ToString("N")),
            //new Claim(TokenKeys.accessTokenId,accessTokenId)
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"]!)
        );

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: accessTokenExpiration,
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );


        string accessToken = new JwtSecurityTokenHandler().WriteToken(token);

        return new AuthenticationToken()
        {
            AccessToken = accessToken,
            AccessTokenId = accessTokenId,
            AccessTokenExpiration = accessTokenExpiration,
            RefreshToken = refreshToken ?? Guid.NewGuid().ToString("N"),
            RefreshTokenExpiration = refreshTokenExpiration
        };
    }

    

    public string GenerateRefreshToken()
    {
        return Guid.NewGuid().ToString("N");
    }

    public ICurrentUserContext ValidateAccessToken(string accessToken)
    {
        TokenValidationParameters tokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = _config["Jwt:Issuer"],
            ValidAudience = _config["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!)),

            NameClaimType = "sub",
        };

        JwtSecurityTokenHandler jwtSecurityTokenHandler = new JwtSecurityTokenHandler();
        try
        {
            SecurityToken validatedToken;
            ClaimsPrincipal claims = jwtSecurityTokenHandler.ValidateToken(accessToken, tokenValidationParameters, out validatedToken);
            
            var sub = claims.FindFirst(TokenKeys.sub);
            var name = claims.FindFirst(TokenKeys.name);
            var userId = claims.FindFirst(TokenKeys.userId);
            var organizationId = claims.FindFirst(TokenKeys.organizationId);
            var accessTokenId = claims.FindFirst(TokenKeys.accessTokenId);


            var currentUser = new CurrentUserContext()
            {
                UserId = userId != null ? Guid.Parse(userId.Value) : Guid.Empty,
                Email = sub != null ? sub.Value : String.Empty,
                DisplayName = name != null ? name.Value : String.Empty,
                OrganizationId = organizationId != null ? Guid.Parse(organizationId.Value) : Guid.Empty,
                AccessTokenId = accessTokenId != null ? accessTokenId.Value : String.Empty,
                AccessLevel = AccessLevel.None,
                AccessibleOrganizationList = new List<Guid>()

            };

            return currentUser;
        }
        catch (SecurityTokenExpiredException) {
            throw new UnAuthorizedException("Token Expired");
        }
        catch (Exception)
        {
            throw new UnAuthorizedException("Validation Issue Encountered");
        }
        

    }

}
