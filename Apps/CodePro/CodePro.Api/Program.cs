using CodePro.Application;
using CodePro.Infrastructure;
using CodePro.Infrastructure.Data;
using Platform.Api.Configuration;

// .env dosyasını CreateBuilder'dan önce yükle (process env'de olanlar override edilmez).
EnvFileLoader.Load(Directory.GetCurrentDirectory());

var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args,
    ContentRootPath = AppContext.BaseDirectory,
});

builder.AddCustomLogging();

builder.Services
    .AddPlatformApi<CodeProDbContext>(builder.Configuration)
    .AddCodeProApplication()
    .AddCodeProInfrastructure(builder.Configuration);

var app = builder.Build();

await app.RunDatabaseMigrationsAsync();

app.UsePlatformPipeline();

app.Run();
