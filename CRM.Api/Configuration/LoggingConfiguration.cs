using System;
using Serilog;
using Serilog.Sinks.Elasticsearch;

namespace CRM.Api.Configuration;

public static class LoggingConfiguration
{
    public static WebApplicationBuilder AddCustomLogging(this WebApplicationBuilder builder)
    {
        // Default logging providers are cleared to use Serilog only
        builder.Logging.ClearProviders();

        builder.Host.UseSerilog((context, services, configuration) =>
            {
                configuration
                    .ReadFrom.Configuration(context.Configuration)
                    .ReadFrom.Services(services)
                    .Enrich.FromLogContext()
                    .Enrich.WithProperty("Application", "CRM.Api")
                    .WriteTo.Console(
                        outputTemplate:
                        "[{Timestamp:HH:mm:ss}] "+
                        "[{Level}] " +
                        "[{SourceContext}] " +
                        "[{CorrelationId}] " +
                        "[{HttpMethod}] " +
                        "[{Path}] " +
                        "[{StatusCode}] " +
                        "[{DurationMs}ms] " +
                        "{Message:lj}{NewLine}{Exception}"
                    );


                var elasticSection = context.Configuration.GetSection("Logging:Elastic");
                var elasticEnabled = elasticSection.GetValue<bool>("Enabled");

                if (elasticEnabled)
                {
                    var elasticUrl = elasticSection.GetValue<string>("Url");
                    var indexPrefix = elasticSection.GetValue<string>("IndexPrefix");

                    configuration.WriteTo.Elasticsearch(
                        new ElasticsearchSinkOptions(new Uri(elasticUrl!))
                        {
                            IndexFormat = $"{indexPrefix}-logs-{context.HostingEnvironment.EnvironmentName.ToLower()}-{DateTime.UtcNow:yyyy-MM}",
                            AutoRegisterTemplate = true,
                            MinimumLogEventLevel = Serilog.Events.LogEventLevel.Information,
                            ModifyConnectionSettings = x =>
                            {
                                var username = elasticSection.GetValue<string>("Username");
                                var password = elasticSection.GetValue<string>("Password");

                                if (!string.IsNullOrWhiteSpace(username))
                                {
                                    x = x.BasicAuthentication(username, password);
                                }

                                return x;
                            }
                        });
                }
            });

        return builder;
    }
}
