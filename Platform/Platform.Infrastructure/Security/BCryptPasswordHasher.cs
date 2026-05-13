using Platform.Application.Common.Security;

namespace Platform.Infrastructure.Security;

/// <summary>
/// BCrypt-Next tabanlı <see cref="IPasswordHasher"/> implementasyonu. Cost 11 (BCrypt default'u).
/// Salt her hash çağrısında otomatik üretilir; ayrıca dışarıdan bir secret/key gerekmez —
/// hash kendi salt'ını içerir ve <see cref="Verify"/> de bunu kullanır.
/// </summary>
public sealed class BCryptPasswordHasher : IPasswordHasher
{
    public string Hash(string password) =>
        BCrypt.Net.BCrypt.HashPassword(password);

    public bool Verify(string password, string hash) =>
        BCrypt.Net.BCrypt.Verify(password, hash);
}
