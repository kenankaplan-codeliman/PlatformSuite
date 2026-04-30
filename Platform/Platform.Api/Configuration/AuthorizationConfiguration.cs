using System;
using Platform.Api.Authorization;
using Platform.Application.Interfaces;
using Platform.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authorization;

namespace Platform.Api.Configuration;

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
