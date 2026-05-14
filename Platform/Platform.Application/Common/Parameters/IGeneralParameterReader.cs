namespace Platform.Application.Common.Parameters;

/// <summary>
/// GeneralParameter tablosuna karşı kod doğrulaması yapan paylaşılan servis.
/// Enum yerine string tutan alanların handler'larında business-rule kontrolü
/// için kullanılır (input validation değil — DB gerektirir).
/// </summary>
public interface IGeneralParameterReader
{
    /// <summary>
    /// <paramref name="parentCode"/> grubu altında aktif bir <paramref name="code"/>
    /// kaydı var mı?
    /// </summary>
    Task<bool> ExistsAsync(string parentCode, string code, CancellationToken cancellationToken = default);
}
