using CRM.Application.Authentication.Interfaces;
using CRM.Application.CommandHandler;
using CRM.Application.Interfaces;
using CRM.Infrastructure.Authentication;
using CRM.Infrastructure.Cache;
using CRM.Infrastructure.Data;
using CRM.Infrastructure.Model;
using CRM.Infrastructure.Repositories;
using System;

namespace CRM.Api.Configuration;

public static class DependencyInjection
{
    public static IServiceCollection AddDependencies(this IServiceCollection services)
    {
        services.AddMemoryCache();//Redis Kullandığın da bunu kaldır
        services.AddScoped<ICacheService, MemoryCacheService>();

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IOrganizationRepository, OrganizationRepository>();
        services.AddScoped<IRoleRepository, RoleRepository>();

        services.AddScoped<ICurrentUserContext, CurrentUserContext>();
        services.AddScoped<ITokenService, JwtTokenService>();
        services.AddScoped<IUnitOfWork, EfUnitOfWork>();
        services.AddScoped<IMicrosoftGraphService, MicrosoftGraphService>();
        
        services.AddScoped<ISessionService, SessionService>();
        

        services.AddScoped<AuthenticationCommandHandler>();
        services.AddScoped<LeadCommandHandler>();

        

        return services;
    }
}
