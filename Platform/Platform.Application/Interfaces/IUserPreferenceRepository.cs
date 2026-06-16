using Platform.Domain.Entities.Preferences;

namespace Platform.Application.Interfaces;

public interface IUserPreferenceRepository : IEntityRepository<UserPreference>
{
    /// <summary>Oturum kullanıcısının verilen anahtardaki tercihini getirir (tracked); yoksa null.</summary>
    Task<UserPreference?> GetForCurrentUserAsync(string preferenceKey, CancellationToken cancellationToken = default);
}
