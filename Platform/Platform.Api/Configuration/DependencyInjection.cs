using Platform.Application.CommandHandler;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Assistant;
using Platform.Application.Common.Assistant.Analytics;
using Platform.Application.Common.Llm;
using Platform.Application.Common.Numbering;
using Platform.Application.Common.References;
using Platform.Application.Common.Security;
using Platform.Application.Interfaces;
using Platform.Application.Modals;
using Platform.Application.Modals.Authentication;
using Platform.Infrastructure.Assistant;
using Platform.Infrastructure.Assistant.Analytics;
using Platform.Infrastructure.Data;
using Platform.Infrastructure.HostedServices;
using Platform.Infrastructure.Llm;
using Platform.Infrastructure.Numbering;
using Platform.Infrastructure.References;
using Platform.Infrastructure.Repositories;
using Platform.Infrastructure.Security;
using Platform.Infrastructure.Services;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.DependencyInjection;

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
        services.AddSingleton<IPasswordHasher, BCryptPasswordHasher>();
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

        // EntityReference resolver registry — Activity.RegardingEntityType polimorfik
        // referans çözümlemesinin omurgası. Her uygulama (CRM, CodePro) AddXxxInfrastructure
        // içinde kendi entity'leri için IEntityReferenceResolver kayıtları ekler.
        services.AddScoped<IEntityReferenceResolverRegistry, EntityReferenceResolverRegistry>();
        services.AddScoped<IEntityReferenceResolver, UserReferenceResolver>();
        services.AddScoped<IEntityReferenceResolver, AppOrganizationReferenceResolver>();
        services.AddScoped<IEntityReferenceResolver, AppRoleReferenceResolver>();
        services.AddScoped<IReferenceRepository, ReferenceRepository>();

        // ── AI Asistan ────────────────────────────────────────────────────────
        // Çekirdek Platform'da; iş fonksiyonları (araçlar) her uygulamanın
        // AddXxxInfrastructure içinde IAssistantTool olarak kaydedilir (EntityReference
        // resolver registry'siyle aynı desen). Registry, DI'a kayıtlı tüm IAssistantTool'ları
        // otomatik toplar.
        services.AddScoped<IAssistantToolRegistry, AssistantToolRegistry>();
        services.AddScoped<IAssistantRequestContext, AssistantRequestContext>();
        services.AddScoped<IAssistantOrchestrator, AssistantOrchestrator>();
        // Yazma araçları için harness-zorlamalı onay (imzalı token) — prompt-injection koruması.
        services.AddSingleton<IActionConfirmationService, ActionConfirmationService>();

        // Generic, reflection-tabanlı analitik — entity-bağımsız. Yeni entity eklenince burada
        // değişiklik gerekmez; tüm IOwnedEntity entity'leri otomatik analiz edilebilir olur.
        services.AddScoped<IAnalyticsEngine, DynamicAnalyticsEngine>();
        services.AddScoped<IAssistantTool, AnalyticsSchemaTool>();
        services.AddScoped<IAssistantTool, AnalyticsQueryTool>();

        // Sağlayıcı-bağımsız LLM istemcisi. Provider config ile seçilir; v1: Anthropic.
        // Başka bir sağlayıcıya geçmek = yeni ILlmClient implementasyonu + bu blokta tek satır.
        var llmProvider = configuration["Llm:Provider"] ?? "anthropic";
        if (string.Equals(llmProvider, "anthropic", StringComparison.OrdinalIgnoreCase))
        {
            var baseUrl = configuration["Anthropic:BaseUrl"] ?? "https://api.anthropic.com";
            // x-api-key header'ı AnthropicLlmClient içinde istek başına eklenir (config'ten okur,
            // boşsa net hata verir) — burada base url + version + timeout yeter.
            services.AddHttpClient<ILlmClient, AnthropicLlmClient>(client =>
            {
                client.BaseAddress = new Uri(baseUrl);
                client.DefaultRequestHeaders.Add("anthropic-version", "2023-06-01");
                client.Timeout = TimeSpan.FromSeconds(120);
            });
        }

        // Numbering — gapless doküman numarası üretimi. Resolver DI'a kayıtlı tüm
        // INumberFormatStrategy'leri toplar; her uygulama AddXxxApplication içinde
        // kendi doküman tipleri için strategy kayıtları ekler.
        services.AddSingleton<INumberFormatStrategyResolver, NumberFormatStrategyResolver>();
        services.AddScoped<INumberGeneratorService, NumberGeneratorService>();

        services.AddScoped<IAuthUserRepository, AuthUserRepository>();
        services.AddScoped<IAuthOrganizationRepository, AuthOrganizationRepository>();
        services.AddScoped<IAuthRoleRepository, AuthRoleRepository>();
        services.AddScoped<IAuthUserLoginRepository, AuthUserLoginRepository>();
        services.AddScoped<IAuditRepository, AuditRepository>();
        services.AddScoped<IAttachmentRepository, AttachmentRepository>();

        // Süresi geçen draft attachment'ları saatte bir temizler.
        services.AddHostedService<AttachmentCleanupService>();

        //Command Handler (Activity henüz MediatR thin-wrapper ile çalışıyor)
        services.AddScoped<AuthenticationCommandHandler>();
        services.AddScoped<ActivityCommandHandler>();
        services.AddScoped<AuditCommandHandler>();

        return services;
    }
}
