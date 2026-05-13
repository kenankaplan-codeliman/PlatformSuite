namespace Platform.Application.Common.Security;

/// <summary>
/// Şifre hash'leme abstraction'ı. Migration seed'leri, kayıt akışı ve şifre değiştirme handler'ları
/// doğrudan BCrypt çağırmak yerine bu interface'i kullanır; algoritma/parametre değişirse tek noktadan
/// kontrol edilebilir.
/// </summary>
public interface IPasswordHasher
{
    string Hash(string password);
    bool Verify(string password, string hash);
}
