using System;
using System.Collections.Generic;
using NpgsqlTypes;
using Serilog;
using Serilog.Events;
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
                        "[{Timestamp:HH:mm:ss}] " +
                        "[{Level}] " +
                        "[{SourceContext}] " +
                        "[{CorrelationId}] " +
                        "[{UserId}] " +
                        "[{HttpMethod}] " +
                        "[{Path}] " +
                        "[{StatusCode}] " +
                        "[{DurationMs}ms] " +
                        "{Message:lj}{NewLine}{Exception}"
                    );

                var fileSection = context.Configuration.GetSection("Logging:File");
                var fileEnabled = fileSection.GetValue<bool>("Enabled");

                if (fileEnabled)
                {
                    var filePath = fileSection.GetValue<string>("Path") ?? "logs/crm-api-.log";
                    var fileLevel = fileSection.GetValue<string>("MinimumLevel") ?? "Information";
                    var retainedDays = fileSection.GetValue<int?>("RetainedDays") ?? 31;

                    if (!Enum.TryParse<LogEventLevel>(fileLevel, ignoreCase: true, out var fileLogLevel))
                        fileLogLevel = LogEventLevel.Information;

                    configuration.WriteTo.File(
                        path: filePath,
                        rollingInterval: RollingInterval.Day,
                        retainedFileCountLimit: retainedDays,
                        restrictedToMinimumLevel: fileLogLevel,
                        outputTemplate:
                            "[{Timestamp:yyyy-MM-dd HH:mm:ss}] " +
                            "[{Level:u3}] " +
                            "[{SourceContext}] " +
                            "[{CorrelationId}] " +
                            "[{UserId}] " +
                            "[{HttpMethod}] " +
                            "[{Path}] " +
                            "[{StatusCode}] " +
                            "[{DurationMs}ms] " +
                            "{Message:lj}{NewLine}{Exception}"
                    );
                }

                var elasticSection = context.Configuration.GetSection("Logging:Elastic");
                var elasticEnabled = elasticSection.GetValue<bool>("Enabled");

                if (elasticEnabled)
                {
                    var elasticUrl = elasticSection.GetValue<string>("Url");
                    var indexPrefix = elasticSection.GetValue<string>("IndexPrefix");
                    var elasticLevel = elasticSection.GetValue<string>("MinimumLevel") ?? "Information";

                    if (!Enum.TryParse<LogEventLevel>(elasticLevel, ignoreCase: true, out var elasticLogLevel))
                        elasticLogLevel = LogEventLevel.Information;

                    configuration.WriteTo.Elasticsearch(
                        new ElasticsearchSinkOptions(new Uri(elasticUrl!))
                        {
                            IndexFormat = $"{indexPrefix}-logs-{context.HostingEnvironment.EnvironmentName.ToLower()}-{DateTime.UtcNow:yyyy-MM}",
                            AutoRegisterTemplate = true,
                            MinimumLogEventLevel = elasticLogLevel,
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
