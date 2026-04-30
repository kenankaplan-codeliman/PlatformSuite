using System.Reflection;
using CodePro.Application.Mapping;
using CodePro.Domain.Authorization;
using Platform.Domain.Authorization;
using FluentValidation;
using Mapster;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace CodePro.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddCodeProApplication(this IServiceCollection services)
    {
        var assembly = Assembly.GetExecutingAssembly();

        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(assembly));
        services.AddValidatorsFromAssembly(assembly);

        // CodePro mapping'leri Platform'un GlobalSettings'i üzerine eklenir.
        CodeProMappingConfig.Register(TypeAdapterConfig.GlobalSettings);

        // CodePro privilege code'ları platform-seviyesi PrivilegeRegistry'ye dahil edilir.
        PrivilegeRegistry.Register(typeof(CodeProPrivilegeCodes));

        return services;
    }
}
