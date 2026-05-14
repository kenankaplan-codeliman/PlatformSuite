using Platform.Domain.Enums;

namespace Platform.Infrastructure.Numbering;

/// <summary>
/// <see cref="CounterResetPeriod"/> + tarih → PeriodKey string'i.
/// Yıl/ay/çeyrek değişiminde farklı bir key üretir; bu sayede
/// (DocumentType, PeriodKey) unique constraint'i yeni satır oluşturur
/// ve sayaç otomatik sıfırlanır.
/// </summary>
internal static class PeriodKeyCalculator
{
    public static string Calculate(CounterResetPeriod period, DateTime utcNow)
    {
        return period switch
        {
            CounterResetPeriod.Never     => "ALL",
            CounterResetPeriod.Yearly    => utcNow.Year.ToString(),
            CounterResetPeriod.Monthly   => $"{utcNow.Year}-{utcNow.Month:D2}",
            CounterResetPeriod.Quarterly => $"{utcNow.Year}-Q{(utcNow.Month - 1) / 3 + 1}",
            _ => throw new ArgumentOutOfRangeException(nameof(period))
        };
    }
}
