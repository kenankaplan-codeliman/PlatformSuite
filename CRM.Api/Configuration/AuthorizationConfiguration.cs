using System;
using CRM.Api.Authorization;
using CRM.Application.Interfaces;
using CRM.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authorization;

namespace CRM.Api.Configuration;

public static class AuthorizationConfiguration
{
    public static IServiceCollection AddPrivilegeAuthorization(this IServiceCollection services)
    {
        services.AddAuthorization(options =>
        {
            //Privilege Authorization Register
            options.AddPolicy(nameof(PrivilegeAuthorizationRequirement), 
                policy => policy.Requirements.Add(new PrivilegeAuthorizationRequirement()));
        });
        
        services.AddScoped<IAuthorizationHandler, PrivilegeAuthorizationHandler>();

        return services;
    }
}
