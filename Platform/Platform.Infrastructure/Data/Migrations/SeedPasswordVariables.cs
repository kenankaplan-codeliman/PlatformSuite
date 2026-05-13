using Platform.Application.Common.Security;

namespace Platform.Infrastructure.Data.Migrations;

/// <summary>
/// Platform seed script'lerinde referans verilen DbUp değişkenini hesaplar:
/// <c>$DefaultPasswordHash$</c>. Tüm seed user'ları (InitData admin/user ve SampleData
/// kullanıcıları) aynı parolayla başlatılır; hash'leme runtime'da app'in
/// <see cref="IPasswordHasher"/> servisi tarafından yapılır — script içeriğinde hardcoded
/// hash bulunmaz, dolayısıyla algoritma/parametre değiştiğinde de uyumsuzluk olmaz.
/// </summary>
public static class SeedPasswordVariables
{
    public const string DefaultPassword = "123";

    public static IDictionary<string, string> Build(IPasswordHasher hasher) => new Dictionary<string, string>
    {
        ["DefaultPasswordHash"] = hasher.Hash(DefaultPassword),
    };
}
