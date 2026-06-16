namespace Platform.Application.Features.UserPreferences.Dtos;

/// <summary>Kullanıcı tercihi. Hiç kaydı yoksa <see cref="Value"/> null döner.</summary>
public class UserPreferenceItem
{
    public string Key { get; set; } = default!;
    public string? Value { get; set; }
}
