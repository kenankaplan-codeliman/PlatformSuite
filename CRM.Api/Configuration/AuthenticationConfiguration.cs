using CRM.Application.Authentication.Interfaces;
using CRM.Application.Interfaces;
using CRM.Domain.Enums;
using CRM.Infrastructure.Authentication;
using CRM.Infrastructure.Model;
using CRM.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Graph.Models.CallRecords;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using static CRM.Infrastructure.Authentication.JwtTokenService;

namespace CRM.Api.Configuration;

public static class AuthenticationConfiguration
{
    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.MapInboundClaims = false;

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = configuration["Jwt:Issuer"],
                    ValidAudience = configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!)),

                    NameClaimType = "sub",
                    RoleClaimType = "roles"
                };

                options.Events = new JwtBearerEvents
                {
                    OnTokenValidated = async context =>
                    {
                        var sessionService = context.HttpContext.RequestServices.GetRequiredService<ISessionService>();
                        var currentUserContext = context.HttpContext.RequestServices.GetRequiredService<ICurrentUserContext>();

                        var accessTokenId = context.Principal?.FindFirst(TokenKeys.sub)?.Value;

                        if (string.IsNullOrEmpty(accessTokenId))
                        {
                            context.Fail("Session ID not found in token");
                            return;
                        }

                        var currentUserContextCached = await sessionService.GetSessionUser(accessTokenId);

                        if (currentUserContextCached == null)
                        {
                            context.Fail("Session not found");
                            return;
                        }

                        if (currentUserContext is CurrentUserContext user)
                        {
                            user.UserId = currentUserContextCached.UserId;
                            user.Email = currentUserContextCached.Email;
                            user.DisplayName = currentUserContextCached.DisplayName;
                            user.OrganizationId = currentUserContextCached.OrganizationId;
                            user.AccessLevel = currentUserContextCached.AccessLevel;
                            user.AccessibleOrganizationList = currentUserContextCached.AccessibleOrganizationList;
                        }
                        else
                        {
                            context.Fail("Session is not valid");
                            return;

                        }


                        // Claims ekle
                        /*
                        var claims = new List<Claim>()
                                        {
                                            new Claim(TokenKeys.userId, currentUserContext.UserId.ToString("N")),
                                            new Claim(TokenKeys.organizationId, currentUserContext.OrganizationId.ToString("N")),
                                        };

                        var appIdentity = new ClaimsIdentity(claims);
                        context.Principal?.AddIdentity(appIdentity);
                        */
                    }
                };


            });

        return services;
    }
}
