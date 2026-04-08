namespace CRM.Api.Configuration;

/// <summary>
/// Loads key=value pairs from the project-root .env file into process environment variables
/// before WebApplication.CreateBuilder runs — so ASP.NET Core's env-var config provider picks them up.
///
/// Variables already present in the process (injected by Docker or the OS) are never overwritten,
/// so Docker container values always take precedence over the file.
/// </summary>
public static class EnvFileLoader
{
    public static void Load(string directory)
    {
        var filePath = Path.Combine(directory, ".env");

        if (!File.Exists(filePath)) return;

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
}
