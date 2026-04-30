using Crm.Application.Interfaces;
using Crm.Infrastructure.Data;
using Crm.Infrastructure.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Crm.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddCrmInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // ICrmDbContext → CrmDbContext (CrmDbContext zaten HostBuilderExtensions tarafından kayıt edildi).
        services.AddScoped<ICrmDbContext>(sp => sp.GetRequiredService<CrmDbContext>());

        // CRM-spesifik repository'ler
        services.AddScoped<ILeadRepository, LeadRepository>();
        services.AddScoped<IOpportunityRepository, OpportunityRepository>();

        return services;
    }
}
