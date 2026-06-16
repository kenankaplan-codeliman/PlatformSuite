using Platform.Application.Common.Abstractions;
using Platform.Application.Features.UserPreferences.Dtos;

namespace Platform.Application.Features.UserPreferences.Commands.SaveUserPreference;

/// <summary>Oturum kullanıcısının verilen anahtardaki tercihini upsert eder.</summary>
public sealed record SaveUserPreferenceCommand(string Key, string Value)
    : ICommand<UserPreferenceItem>;
