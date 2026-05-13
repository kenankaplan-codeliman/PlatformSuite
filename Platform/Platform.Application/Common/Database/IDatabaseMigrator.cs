namespace Platform.Application.Common.Database;

/// <summary>
/// Uygulama başlatılırken DB şemasını günceller. Implementasyon Platform script'lerini ve
/// app'e özgü script'leri birlikte koşturur. Hata durumunda exception fırlatır — bu kasıtlı:
/// migration patlarsa <c>app.Run()</c> çağrılmaz, deploy doğru sinyali verir.
/// </summary>
public interface IDatabaseMigrator
{
    Task MigrateAsync(CancellationToken cancellationToken);
}
