using Microsoft.EntityFrameworkCore;

using CRM.Api.Middleware;
using CRM.Infrastructure.Data;

using CRM.Api.Configuration;
using CRM.Api.HostedServices;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<DatabaseContext>(
    options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")),
    ServiceLifetime.Scoped
);

builder.AddCustomLogging();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services
    .AddCorsConfiguration()
    .AddSwagger()
    .AddValidation()
    .AddDependencies()
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

