using Crm.Application;
using Crm.Infrastructure;
using Crm.Infrastructure.Data;
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
    .AddPlatformApi<CrmDbContext>(builder.Configuration)
    .AddCrmApplication()
    .AddCrmInfrastructure(builder.Configuration);

var app = builder.Build();

app.UsePlatformPipeline();

app.Run();
