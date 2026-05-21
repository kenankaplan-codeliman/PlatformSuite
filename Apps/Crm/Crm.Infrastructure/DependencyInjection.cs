using Crm.Application.Interfaces;
using Crm.Infrastructure.Data;
using Crm.Infrastructure.Data.Migrations;
using Crm.Infrastructure.Metadata;
using Crm.Infrastructure.References;
using Crm.Infrastructure.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Platform.Application.Common.Database;
using Platform.Application.Common.Metadata;
using Platform.Application.Common.References;
using Platform.Application.Interfaces;

namespace Crm.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddCrmInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // ICrmDbContext → CrmDbContext (CrmDbContext zaten HostBuilderExtensions tarafından kayıt edildi).
        services.AddScoped<ICrmDbContext>(sp => sp.GetRequiredService<CrmDbContext>());

        // DB migration runner — Program.cs'te app.RunDatabaseMigrationsAsync() tarafından çağrılır.
        services.AddScoped<IDatabaseMigrator, CrmDatabaseMigrator>();

        // CRM-spesifik repository'ler
        services.AddScoped<IAccountRepository, AccountRepository>();
        services.AddScoped<IContactRepository, ContactRepository>();
        services.AddScoped<ICommunicationRepository, CommunicationRepository>();
        services.AddScoped<ILeadRepository, LeadRepository>();
        services.AddScoped<IOpportunityRepository, OpportunityRepository>();

        // CRM entity'leri için Activity.RegardingEntityType / ParticipantEntityType resolver kayıtları
        services.AddScoped<IEntityReferenceResolver, AccountReferenceResolver>();
        services.AddScoped<IEntityReferenceResolver, ContactReferenceResolver>();
        services.AddScoped<IEntityReferenceResolver, LeadReferenceResolver>();
        services.AddScoped<IEntityReferenceResolver, OpportunityReferenceResolver>();

        // Generic ortak metadata (audit/owner/state) resolver'ı — CRM entity'lerinin tamamını kapsar.
        services.AddScoped<IEntityMetadataResolver, CrmEntityMetadataResolver>();

        return services;
    }
}
