using Platform.Application.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Platform.Infrastructure.HostedServices;

/// <summary>
/// Saatte bir, ilişkilendirilmemiş (ExpiresAt set'li) draft attachment'ları siler.
/// Frontend bir entity formuna dosya yükleyip kaydetmeden çıktığında, yüklenen
/// metadata + file_data orphan kalır — bu servis onları temizler.
/// </summary>
public sealed class AttachmentCleanupService : BackgroundService
{
    private static readonly TimeSpan Interval = TimeSpan.FromHours(1);

    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<AttachmentCleanupService> _logger;

    public AttachmentCleanupService(
        IServiceProvider serviceProvider,
        ILogger<AttachmentCleanupService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var repository = scope.ServiceProvider.GetRequiredService<IAttachmentRepository>();
                var deleted = await repository.DeleteExpiredDraftsAsync(DateTime.UtcNow, stoppingToken);

                if (deleted > 0)
                    _logger.LogInformation("AttachmentCleanupService: {Count} expired draft attachment silindi.", deleted);
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                _logger.LogError(ex, "AttachmentCleanupService temizlik turu başarısız.");
            }

            try
            {
                await Task.Delay(Interval, stoppingToken);
            }
            catch (OperationCanceledException)
            {
                break;
            }
        }
    }
}
