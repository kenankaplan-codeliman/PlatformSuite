using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Platform.Application.Common.Assistant;
using Microsoft.Extensions.Configuration;

namespace Platform.Infrastructure.Assistant;

/// <summary>
/// Onay token'ını HMAC-SHA256 ile imzalar (dış bağımlılık yok). Token = base64url(payload) + "." +
/// base64url(HMAC). Doğrulama imzayı sabit-zamanlı karşılaştırır, süreyi ve kullanıcıyı kontrol eder.
/// İmza anahtarı `Assistant:SigningKey`, yoksa mevcut `Jwt:Key`'den alınır.
/// </summary>
public sealed class ActionConfirmationService : IActionConfirmationService
{
    private readonly byte[] _key;

    public ActionConfirmationService(IConfiguration configuration)
    {
        var key = configuration["Assistant:SigningKey"] ?? configuration["Jwt:Key"]
            ?? throw new InvalidOperationException("Asistan onay imzası için Assistant:SigningKey veya Jwt:Key gerekli.");
        _key = Encoding.UTF8.GetBytes(key);
    }

    public string Issue(PendingActionPayload payload)
    {
        var body = Base64Url(JsonSerializer.SerializeToUtf8Bytes(payload));
        return body + "." + Base64Url(Sign(body));
    }

    public PendingActionPayload? Verify(string token, Guid currentUserId)
    {
        if (string.IsNullOrWhiteSpace(token))
            return null;

        var parts = token.Split('.');
        if (parts.Length != 2)
            return null;

        var expected = Sign(parts[0]);
        byte[] actual;
        try { actual = Base64UrlDecode(parts[1]); }
        catch (FormatException) { return null; }

        if (!CryptographicOperations.FixedTimeEquals(expected, actual))
            return null;

        PendingActionPayload? payload;
        try { payload = JsonSerializer.Deserialize<PendingActionPayload>(Base64UrlDecode(parts[0])); }
        catch (Exception ex) when (ex is FormatException or JsonException) { return null; }

        if (payload is null)
            return null;
        if (payload.ExpiresAtUnix < DateTimeOffset.UtcNow.ToUnixTimeSeconds())
            return null;
        if (payload.UserId != currentUserId)
            return null;

        return payload;
    }

    private byte[] Sign(string body) =>
        HMACSHA256.HashData(_key, Encoding.UTF8.GetBytes(body));

    private static string Base64Url(byte[] bytes) =>
        Convert.ToBase64String(bytes).TrimEnd('=').Replace('+', '-').Replace('/', '_');

    private static byte[] Base64UrlDecode(string value)
    {
        var s = value.Replace('-', '+').Replace('_', '/');
        s = (s.Length % 4) switch { 2 => s + "==", 3 => s + "=", _ => s };
        return Convert.FromBase64String(s);
    }
}
