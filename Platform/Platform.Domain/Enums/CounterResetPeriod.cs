namespace Platform.Domain.Enums;

/// <summary>
/// Numarator sayacının hangi periyotta sıfırlanacağını belirler.
/// PeriodKey bu değere göre üretilir (Never → "ALL", Yearly → "2026", ...).
/// </summary>
public enum CounterResetPeriod
{
    Never = 0,    // Sürekli artar: 1, 2, 3, ...
    Yearly = 1,   // Her yıl sıfırlanır
    Monthly = 2,  // Her ay sıfırlanır
    Quarterly = 3 // Her çeyrek sıfırlanır
}
