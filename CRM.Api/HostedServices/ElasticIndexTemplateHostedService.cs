using Elasticsearch.Net;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
namespace CRM.Api.HostedServices;

public sealed class ElasticIndexTemplateHostedService : IHostedService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<ElasticIndexTemplateHostedService> _logger;

    public ElasticIndexTemplateHostedService(
        IConfiguration configuration,
        ILogger<ElasticIndexTemplateHostedService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        var elastic = _configuration.GetSection("Logging:Elastic");
        if (!elastic.GetValue<bool>("Enabled"))
        {
            _logger.LogInformation("Elastic disabled. Template initialization skipped.");
            return;
        }

        var url = elastic.GetValue<string>("Url");
        if (string.IsNullOrWhiteSpace(url))
        {
            _logger.LogWarning("Elastic Url not configured.");
            return;
        }

        var pool = new SingleNodeConnectionPool(new Uri(url));
        var settings = new ConnectionConfiguration(pool);

        var username = elastic.GetValue<string>("Username");
        var password = elastic.GetValue<string>("Password");

        if (!string.IsNullOrWhiteSpace(username))
        {
            settings = settings.BasicAuthentication(username, password);
        }

        var client = new ElasticLowLevelClient(settings);

        const string templateName = "codeliman-crm-api-logs";
        var templatePath = $"/_index_template/{templateName}";

        // GET
        var getResponse = await client.DoRequestAsync<StringResponse>(
            Elasticsearch.Net.HttpMethod.GET,
            templatePath,
            cancellationToken);

        if (getResponse.Success)
        {
            _logger.LogInformation(
                "Elastic index template '{Template}' already exists.",
                templateName);
            return;
        }

        if (getResponse.HttpStatusCode != 404)
        {
            _logger.LogError(
                "Failed to query index template '{Template}'. Status: {Status}, Body: {Body}",
                templateName,
                getResponse.HttpStatusCode,
                getResponse.Body);
            return;
        }

        // CREATE
        var createResponse = await client.DoRequestAsync<StringResponse>(
            Elasticsearch.Net.HttpMethod.PUT,
            templatePath,
            cancellationToken,
            PostData.String(GetTemplateJson()));

        if (!createResponse.Success)
        {
            _logger.LogError(
                "Failed to create index template '{Template}'. Status: {Status}, Body: {Body}",
                templateName,
                createResponse.HttpStatusCode,
                createResponse.Body);
            return;
        }

        _logger.LogInformation(
            "Elastic index template '{Template}' created successfully.",
            templateName);
    }

    public Task StopAsync(CancellationToken cancellationToken)
        => Task.CompletedTask;

    private static string GetTemplateJson() => """
        {
        "index_patterns": ["codeliman-crm-api-logs-*"],
        "priority": 100,
        "template": {
            "settings": {
            "number_of_shards": 1,
            "number_of_replicas": 1,
            "refresh_interval": "10s"
            },
            "mappings": {
            "dynamic": true,
            "properties": {
                "@timestamp": { "type": "date" },
                "Level": { "type": "keyword" },
                "SourceContext": { "type": "keyword" },
                "MessageTemplate": { "type": "text", "index": false },

                "CorrelationId": { "type": "keyword" },
                "UserId": { "type": "keyword" },

                "HttpMethod": { "type": "keyword" },
                "Path": { "type": "keyword" },
                "StatusCode": { "type": "integer" },
                "DurationMs": { "type": "long" },

                "RequestHeaders": { "type": "object", "enabled": false },
                "RequestBody": { "type": "text", "index": false },
                "ResponseBody": { "type": "text", "index": false }
            }
            }
        }
        }
        """;

}
