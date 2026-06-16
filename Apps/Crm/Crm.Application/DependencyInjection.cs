using System.Reflection;
using Crm.Application.Common.Numbering.Strategies;
using Crm.Application.Mapping;
using Crm.Domain.Authorization;
using Platform.Application.Common.Numbering;
using Platform.Domain.Authorization;
using FluentValidation;
using Mapster;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace Crm.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddCrmApplication(this IServiceCollection services)
    {
        var assembly = Assembly.GetExecutingAssembly();

        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(assembly));
        services.AddValidatorsFromAssembly(assembly);

        // CRM Mapster config'leri Platform'un GlobalSettings'i üzerine ekler.
        // Platform.Application.AddApplication() önce çağrıldığı için Platform mapping'leri zaten mevcut.
        CrmMappingConfig.Register(TypeAdapterConfig.GlobalSettings);

        // CRM privilege code'larını platform-seviyesi PrivilegeRegistry'ye dahil et.
        // RoleRepository.CreatePrivileges/CreateRolePrivileges seeding bunu okuyacak.
        PrivilegeRegistry.Register(typeof(CrmPrivilegeCodes));

        // CRM doküman tipleri için numara formatı strategy'leri. Stateless — singleton.
        // Platform'daki NumberFormatStrategyResolver bunları toplar.
        services.AddSingleton<INumberFormatStrategy, OpportunityCodeStrategy>();

        return services;
    }
}
