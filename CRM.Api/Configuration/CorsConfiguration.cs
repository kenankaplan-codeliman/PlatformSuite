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

public static class CorsConfiguration
{
    public static IServiceCollection AddCorsConfiguration(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                policy
                    .AllowAnyOrigin() //.WithOrigins("http://localhost:5501")
                    .AllowAnyHeader()
                    .AllowAnyMethod();
                    //.AllowCredentials();
            });
        });



        return services;
    }
}
