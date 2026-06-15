using System.Text;

namespace Crm.Infrastructure.Assistant;

/// <summary>
/// Bağımlılıksız küçük CSV ayrıştırıcı. Tırnaklı alanları (gömülü virgül/yeni satır/çift tırnak)
/// destekler, ayraç olarak ',' veya ';' otomatik algılar. v1 toplu Lead import için yeterli.
/// </summary>
internal static class SimpleCsv
{
    public static List<Dictionary<string, string>> Parse(byte[] bytes)
    {
        var text = Encoding.UTF8.GetString(bytes);
        if (text.Length > 0 && text[0] == '﻿')
            text = text[1..]; // BOM

        var delimiter = DetectDelimiter(text);
        var records = ParseRecords(text, delimiter);

        var result = new List<Dictionary<string, string>>();
        if (records.Count == 0)
            return result;

        var headers = records[0].Select(h => h.Trim()).ToList();

        for (var r = 1; r < records.Count; r++)
        {
            var row = records[r];
            if (row.Count == 0 || (row.Count == 1 && string.IsNullOrWhiteSpace(row[0])))
                continue;

            var dict = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
            for (var c = 0; c < headers.Count; c++)
            {
                if (string.IsNullOrEmpty(headers[c]))
                    continue;
                dict[headers[c]] = c < row.Count ? row[c] : string.Empty;
            }

            result.Add(dict);
        }

        return result;
    }

    private static char DetectDelimiter(string text)
    {
        var firstLine = text.Split('\n', 2)[0];
        var semicolons = firstLine.Count(ch => ch == ';');
        var commas = firstLine.Count(ch => ch == ',');
        return semicolons > commas ? ';' : ',';
    }

    private static List<List<string>> ParseRecords(string text, char delimiter)
    {
        var records = new List<List<string>>();
        var current = new List<string>();
        var field = new StringBuilder();
        var inQuotes = false;
        var hasContent = false;

        for (var i = 0; i < text.Length; i++)
        {
            var ch = text[i];

            if (inQuotes)
            {
                if (ch == '"')
                {
                    if (i + 1 < text.Length && text[i + 1] == '"')
                    {
                        field.Append('"');
                        i++;
                    }
                    else
                    {
                        inQuotes = false;
                    }
                }
                else
                {
                    field.Append(ch);
                }

                continue;
            }

            if (ch == '"')
            {
                inQuotes = true;
                hasContent = true;
            }
            else if (ch == delimiter)
            {
                current.Add(field.ToString());
                field.Clear();
                hasContent = true;
            }
            else if (ch == '\r')
            {
                // \n üzerinde işlenir
            }
            else if (ch == '\n')
            {
                current.Add(field.ToString());
                field.Clear();
                records.Add(current);
                current = new List<string>();
                hasContent = false;
            }
            else
            {
                field.Append(ch);
                hasContent = true;
            }
        }

        if (hasContent || field.Length > 0 || current.Count > 0)
        {
            current.Add(field.ToString());
            records.Add(current);
        }

        return records;
    }
}
