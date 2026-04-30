using Platform.Application.CommandHandler;
using Platform.Application.Common.Abstractions;
using Platform.Application.Interfaces;
using Platform.Application.Modals;
using Platform.Application.Modals.Authentication;
using Platform.Infrastructure.Data;
using Platform.Infrastructure.Repositories;
using Platform.Infrastructure.Services;
using Microsoft.AspNetCore.DataProtection;

namespace Platform.Api.Configuration;

public static class DependencyInjection
{
    public static IServiceCollection AddDependencies(this IServiceCollection services, IConfiguration configuration)
    {
        // Data Protection — key'leri kalıcı dizine yaz (container restart sonrası kaybolmasın)
        services.AddDataProtection()
            .PersistKeysToFileSystem(new DirectoryInfo("/app/dataprotection-keys"))
            .SetApplicationName("Platform.Api");

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

        // PlatformDbContext + IApplicationDbContext bağlamaları HostBuilderExtensions.cs içinde
        // generic TDbContext üzerinden yapılır (uygulamaya özgü DbContext'e forward edilir).

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
        services.AddScoped<IAccountRepository, AccountRepository>();
        services.AddScoped<IContactRepository, ContactRepository>();
        services.AddScoped<IAppLoginRepository, AppLoginRepository>();
        services.AddScoped<IAuditRepository, AuditRepository>();
        services.AddScoped<IAttachmentRepository, AttachmentRepository>();


        //Command Handler (Activity henüz MediatR thin-wrapper ile çalışıyor)
        services.AddScoped<AuthenticationCommandHandler>();
        services.AddScoped<ActivityCommandHandler>();
        services.AddScoped<AuditCommandHandler>();

        return services;
    }
}
