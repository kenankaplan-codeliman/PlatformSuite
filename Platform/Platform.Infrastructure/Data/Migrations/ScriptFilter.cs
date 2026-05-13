namespace Platform.Infrastructure.Data.Migrations;

/// <summary>
/// Embedded SQL script kaynakları için ortak filter mantığı. Namespace prefix + .sql uzantısı +
/// opsiyonel <see cref="ScriptCategory.SampleData"/> hariç tutma.
/// </summary>
public static class ScriptFilter
{
    private const string SampleDataSegment = ".SampleData.";

    public static bool Matches(string resourceName, string @namespace, bool includeSampleData) =>
        resourceName.StartsWith(@namespace, StringComparison.Ordinal)
        && resourceName.EndsWith(".sql", StringComparison.OrdinalIgnoreCase)
        && (includeSampleData
            || resourceName.IndexOf(SampleDataSegment, StringComparison.Ordinal) < 0);

    public static Func<string, bool> Build(string @namespace, bool includeSampleData) =>
        name => Matches(name, @namespace, includeSampleData);
}
