using CRM.Api.Configuration;
using CRM.Api.HostedServices;
using CRM.Api.Middleware;
using CRM.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

// Load .env before CreateBuilder so ASP.NET Core's env-var config provider picks them up.
// Docker already injects these as process env vars — EnvFileLoader skips any that are already set.
EnvFileLoader.Load(Directory.GetCurrentDirectory());

var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args,
    ContentRootPath = AppContext.BaseDirectory,
});


builder.Services.AddDbContext<DatabaseContext>(
    (sp, options) => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
);


builder.AddCustomLogging();

builder.Services.AddControllers().SetJsonOptions();
builder.Services.AddEndpointsApiExplorer();

builder.Services
    .AddCorsConfiguration()
    .AddSwagger()
    .AddValidation()
    .AddDependencies(builder.Configuration)
    .AddJwtAuthentication(builder.Configuration)
    .AddPrivilegeAuthorization()
    .AddHostedService<DbInitializerHostedService>()
    .AddHostedService<ElasticIndexTemplateHostedService>();



var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseMiddleware<CorrelationIdMiddleware>();   // 1: Collaration ID uretilir
app.UseAuthentication();                        // 2: JWT + User context
app.UseMiddleware<LoggingMiddleware>();         // 3: UserId + HTTP logları
app.UseMiddleware<GlobalExceptionMiddleware>(); // 4: Gerçek exception’lar
app.UseAuthorization();                         // 5: 403 Forbidden

app.MapControllers();

app.Run();

