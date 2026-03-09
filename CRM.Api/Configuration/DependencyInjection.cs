using CRM.Application.CommandHandler;
using CRM.Application.Interfaces;
using CRM.Application.Modals;
using CRM.Application.Modals.Authentication;
using CRM.Infrastructure.Authentication;
using CRM.Infrastructure.Cache;
using CRM.Infrastructure.Data;
using CRM.Infrastructure.Repositories;

namespace CRM.Api.Configuration;

public static class DependencyInjection
{
    public static IServiceCollection AddDependencies(this IServiceCollection services)
    {
        // ======= Rules =======

        services.AddMemoryCache();//Redis Kullandığın da bunu kaldır
        services.AddScoped<ICacheService, MemoryCacheService>();
        services.AddScoped<ISessionService, SessionService>();

        //Auth
        services.AddSingleton<IContextUser, ContextUser>();
        services.AddSingleton<IContextAuthorization, ContextAuthorization>();

        services.AddScoped<ITokenService, JwtTokenService>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IMicrosoftGraphService, MicrosoftGraphService>();

        // Entity Repository
        services.AddScoped<IActivityRepository, ActivityRepository>();
        services.AddScoped<IEmailActivityRepository, EmailActivityRepository>();
        services.AddScoped<IAppointmentActivityRepository, AppointmentActivityRepository>();
        services.AddScoped<ITaskActivityRepository, TaskActivityRepository>();
        services.AddScoped<IPhoneCallActivityRepository, PhoneCallActivityRepository>();

        services.AddScoped<IReferenceRepository, ReferenceRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IOrganizationRepository, OrganizationRepository>();
        services.AddScoped<IRoleRepository, RoleRepository>();
        services.AddScoped<ILeadRepository, LeadRepository>();
        services.AddScoped<IAccountRepository, AccountRepository>();
        services.AddScoped<IContactRepository, ContactRepository>();
        services.AddScoped<IOpportunityRepository, OpportunityRepository>();
        services.AddScoped<IProductRepository, ProductRepository>();


        //Command Handler
        services.AddScoped<UserCommandHandler>();
        services.AddScoped<AuthenticationCommandHandler>();
        services.AddScoped<LeadCommandHandler>();
        services.AddScoped<ActivityCommandHandler>();
        services.AddScoped<UserCommandHandler>();
        services.AddScoped<AccountCommandHandler>();
        services.AddScoped<ContactCommandHandler>();
        services.AddScoped<OpportunityCommandHandler>();
        services.AddScoped<ProductCommandHandler>();


  

        return services;
    }
}
