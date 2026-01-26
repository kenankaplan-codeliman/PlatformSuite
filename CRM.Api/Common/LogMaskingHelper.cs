using System;
using System.Text.RegularExpressions;

namespace CRM.Api.Common;

public static class LogMaskingHelper
{
    private static readonly string Mask = "***";

    private static readonly string[] SensitiveJsonFields =
    {
        "password",
        "token",
        "accessToken",
        "refreshToken",
        "authorization",
        "apiKey",
        "secret"
    };

    public static string MaskJson(string? json)
    {
        if (string.IsNullOrWhiteSpace(json))
            return json ?? string.Empty;

        foreach (var field in SensitiveJsonFields)
        {
            json = Regex.Replace(
                json,
                $"\"{field}\"\\s*:\\s*\".*?\"",
                $"\"{field}\":\"{Mask}\"",
                RegexOptions.IgnoreCase | RegexOptions.Compiled);
        }

        return json;
    }

    public static IDictionary<string, string> MaskHeaders(IHeaderDictionary headers)
    {
        var result = new Dictionary<string, string>();

        foreach (var header in headers)
        {
            if (header.Key.Equals("Authorization", StringComparison.OrdinalIgnoreCase))
            {
                result[header.Key] = Mask;
            }
            else
            {
                result[header.Key] = header.Value.ToString();
            }
        }

        return result;
    }
}