using Platform.Application.Common.Abstractions;
using Platform.Application.Features.UserPreferences.Dtos;

namespace Platform.Application.Features.UserPreferences.Queries.GetUserPreference;

/// <summary>Oturum kullanıcısının verilen anahtardaki tercihi.</summary>
public sealed class GetUserPreferenceQuery : IQuery<UserPreferenceItem>
{
    public string Key { get; init; } = default!;
}
