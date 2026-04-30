namespace Platform.Api.Configuration;

/// <summary>
/// Loads key=value pairs from the nearest .env file (walks up from <paramref name="startDirectory"/>)
/// into process environment variables before WebApplication.CreateBuilder runs.
///
/// Variables already present in the process (injected by Docker or the OS) are never overwritten,
/// so Docker container values always take precedence over the file.
/// </summary>
public static class EnvFileLoader
{
    public static void Load(string startDirectory)
    {
        var filePath = FindEnvFile(startDirectory);
        if (filePath is null) return;

        foreach (var raw in File.ReadAllLines(filePath))
        {
            var line = raw.Trim();

            if (string.IsNullOrEmpty(line) || line.StartsWith('#')) continue;

            var separatorIndex = line.IndexOf('=');
            if (separatorIndex <= 0) continue;

            var key   = line[..separatorIndex].Trim();
            var value = line[(separatorIndex + 1)..].Trim();

            // Docker / OS already injected this — do not override.
            if (Environment.GetEnvironmentVariable(key) is not null) continue;

            Environment.SetEnvironmentVariable(key, value);
        }
    }

    private static string? FindEnvFile(string startDirectory)
    {
        var directory = new DirectoryInfo(startDirectory);
        while (directory is not null)
        {
            var candidate = Path.Combine(directory.FullName, ".env");
            if (File.Exists(candidate)) return candidate;
            directory = directory.Parent;
        }
        return null;
    }
}
