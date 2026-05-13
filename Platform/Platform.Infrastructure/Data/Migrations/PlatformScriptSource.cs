using System.Reflection;

namespace Platform.Infrastructure.Data.Migrations;

/// <summary>
/// Platform'un paylaşılan SQL migration script'lerinin embedded assembly kaynağını ve
/// resource filter helper'larını expose eder. Her app'in migrator'ı bu kaynağı kendi
/// script'lerinden önce koşturur. Script'ler <c>Data/Scripts/&lt;Category&gt;/</c>
/// yapısında organize edilmiştir (kategori klasörleri: <see cref="ScriptCategory"/>);
/// çalıştırma sırası <see cref="ScriptOrderComparer"/> ile belirlenir.
/// </summary>
public static class PlatformScriptSource
{
    public static Assembly Assembly => typeof(PlatformScriptSource).Assembly;

    public const string Namespace = "Platform.Infrastructure.Data.Scripts";

    /// <summary>
    /// Production-safe varsayılan filter — Platform script'lerini namespace + uzantı ile eşleştirir,
    /// SampleData kategorisini hariç tutar.
    /// </summary>
    public static bool Matches(string resourceName) =>
        ScriptFilter.Matches(resourceName, Namespace, includeSampleData: false);

    /// <summary>
    /// Ortam-bilinçli filter (Development/Test/Staging için SampleData dahil).
    /// </summary>
    public static Func<string, bool> MatchesFor(bool includeSampleData) =>
        name => ScriptFilter.Matches(name, Namespace, includeSampleData);
}
