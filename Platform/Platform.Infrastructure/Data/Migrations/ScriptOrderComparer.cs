namespace Platform.Infrastructure.Data.Migrations;

/// <summary>
/// DbUp script çalıştırma sırası comparer'ı. Üç seviyeli karşılaştırma:
/// <list type="number">
///   <item><b>Source</b> — Platform script'leri her zaman app script'lerinden önce
///   (app şeması Platform tablolarına FK verebildiği için).</item>
///   <item><b>Category</b> — <see cref="ScriptCategory.Schema"/> →
///   <see cref="ScriptCategory.InitData"/> → <see cref="ScriptCategory.SampleData"/>.
///   InitData seed'leri Schema tabloları kurulduktan sonra çalışır; SampleData
///   ise zorunlu seed verisi yüklendikten sonra (production hariç ortamlarda).</item>
///   <item><b>Alphabetic</b> — kategori içinde dosya adına göre (V001 &lt; V002 &lt; ...).</item>
/// </list>
/// Embedded resource adlarında klasör yapısı nokta ile temsil edilir
/// (<c>{AssemblyNamespace}.Data.Scripts.{Category}.{ScriptName}</c>).
/// </summary>
public sealed class ScriptOrderComparer : IComparer<string>
{
    public static ScriptOrderComparer Instance { get; } = new();

    public int Compare(string? x, string? y)
    {
        if (x is null && y is null) return 0;
        if (x is null) return -1;
        if (y is null) return 1;

        var sourceDiff = SourcePriority(x) - SourcePriority(y);
        if (sourceDiff != 0) return sourceDiff;

        var categoryDiff = (int)ScriptCategoryResolver.From(x) - (int)ScriptCategoryResolver.From(y);
        if (categoryDiff != 0) return categoryDiff;

        return string.CompareOrdinal(x, y);
    }

    private static int SourcePriority(string resourceName) =>
        resourceName.StartsWith(PlatformScriptSource.Namespace, StringComparison.Ordinal) ? 0 : 1;
}
