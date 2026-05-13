using Platform.Api.HostedServices;
using Platform.Api.Middleware;
using Platform.Application;
using Platform.Application.Common.Abstractions;
using Platform.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Platform.Api.Configuration;

/// <summary>
/// Platform host orkestrasyonu — uygulama host'ları (Crm.Api, CodePro.Api, ...) tek satırda
/// AddPlatformApi&lt;TDbContext&gt; + UsePlatformPipeline çağırır. <typeparamref name="TDbContext"/>
/// uygulamaya özgü DbContext (örn. CrmDbContext); abstract <see cref="PlatformDbContext"/>'ten türemelidir.
/// PlatformDbContext ve IApplicationDbContext bağlamaları otomatik olarak TDbContext'e forward eder,
/// böylece repository'ler ve query handler'lar app-spesifik DbContext'i bilmeden çalışır.
/// </summary>
public static class HostBuilderExtensions
{
    public static IServiceCollection AddPlatformApi<TDbContext>(this IServiceCollection services, IConfiguration configuration)
        where TDbContext : PlatformDbContext, IApplicationDbContext
    {
        var connectionString = PlatformConnectionString.Build(configuration);

        services.AddDbContext<TDbContext>((sp, options) => options.UseNpgsql(connectionString));

        // Repository ve query handler'lar PlatformDbContext / IApplicationDbContext üzerinden tüketir;
        // her ikisi de uygulamaya özgü TDbContext'e forward edilir.
        services.AddScoped<PlatformDbContext>(sp => sp.GetRequiredService<TDbContext>());
        services.AddScoped<IApplicationDbContext>(sp => sp.GetRequiredService<TDbContext>());

        services.AddControllers()
            .AddApplicationPart(typeof(HostBuilderExtensions).Assembly)
            .SetJsonOptions();

        services.AddEndpointsApiExplorer();
        services.AddProblemDetails();
        services.AddExceptionHandler<ProblemDetailsExceptionHandler>();

        services
            .AddApplication()
            .AddCorsConfiguration()
            .AddSwagger()
            .AddValidation()
            .AddDependencies(configuration)
            .AddJwtAuthentication(configuration)
            .AddPrivilegeAuthorization();

        services.AddHostedService<ElasticIndexTemplateHostedService>();

        return services;
    }

    public static WebApplication UsePlatformPipeline(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseCors();
        app.UseMiddleware<CorrelationIdMiddleware>();   // 1: Correlation ID
        app.UseAuthentication();                         // 2: JWT + User context
        app.UseMiddleware<LoggingMiddleware>();          // 3: UserId + HTTP logları
        app.UseExceptionHandler();                       // 4: ProblemDetails
        app.UseAuthorization();                          // 5: 403 Forbidden

        app.MapControllers();

        return app;
    }
}
