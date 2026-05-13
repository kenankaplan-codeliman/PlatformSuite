namespace Platform.Infrastructure.Data.Migrations;

/// <summary>
/// SQL migration script kategorileri. Tüm projelerde script'ler
/// <c>Data/Scripts/&lt;Category&gt;/</c> klasör hiyerarşisi altında organize edilir.
/// <see cref="ScriptOrderComparer"/> bu sıraya göre çalıştırma sırasını belirler.
/// </summary>
public enum ScriptCategory
{
    /// <summary>
    /// Şema evrimi: CREATE / ALTER / DROP TABLE, INDEX, TYPE, CONSTRAINT vb. Tek timeline'da
    /// versiyonlanır — production sonrası yapılan tüm yapısal değişiklikler de buraya yeni
    /// versiyon numarasıyla eklenir.
    /// </summary>
    Schema = 0,

    /// <summary>Çalışma için zorunlu seed verisi (privileges, default org, system users).</summary>
    InitData = 1,

    /// <summary>Demo/test verisi. Production hariç ortamlarda yüklenir.</summary>
    SampleData = 2,

    /// <summary>Kategorisi tanımsız (geriye uyumluluk için). En sona itilir.</summary>
    Unknown = 99,
}

internal static class ScriptCategoryResolver
{
    public static ScriptCategory From(string resourceName)
    {
        if (Contains(resourceName, ".Schema."))     return ScriptCategory.Schema;
        if (Contains(resourceName, ".InitData."))   return ScriptCategory.InitData;
        if (Contains(resourceName, ".SampleData.")) return ScriptCategory.SampleData;
        return ScriptCategory.Unknown;
    }

    private static bool Contains(string s, string needle) =>
        s.IndexOf(needle, StringComparison.Ordinal) >= 0;
}
