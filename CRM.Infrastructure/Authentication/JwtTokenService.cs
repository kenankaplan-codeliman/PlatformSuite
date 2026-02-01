using CRM.Application.Authentication.Interfaces;
using CRM.Application.Exceptions;
using CRM.Application.Interfaces;
using CRM.Application.Modals;
using CRM.Domain.Entities.Identity;
using CRM.Domain.Enums;
using CRM.Infrastructure.Model;
using Microsoft.Extensions.Configuration;
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
    }
    public JwtTokenService(IConfiguration config)
    {
        _config = config;
    }

    public string GenerateToken(string accessTokenId, DateTime accessTokenExpiration)
    {
        var claims = new List<Claim>
        {
            new Claim(TokenKeys.sub, accessTokenId)
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

        return accessToken;
    }

    public string ValidateAccessToken(string accessToken, bool validateLifetime = true)
    {
        TokenValidationParameters tokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = validateLifetime,
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

            var accessTokenId = claims.FindFirst(TokenKeys.sub);

            return accessTokenId!=null ? accessTokenId.Value : string.Empty;
        }
        catch (SecurityTokenExpiredException)
        {
            throw new UnAuthorizedException("Token Expired");
        }
        catch (Exception)
        {
            throw new UnAuthorizedException("Validation Issue Encountered");
        }


    }

}
