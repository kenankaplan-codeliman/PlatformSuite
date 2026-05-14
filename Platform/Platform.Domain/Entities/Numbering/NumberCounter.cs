using Platform.Domain.Enums;

namespace Platform.Domain.Entities.Numbering;

/// <summary>
/// Gapless (boşluksuz) doküman numarası üretimi için sayaç satırı.
/// (DocumentType, PeriodKey) başına tek satır tutulur; numara üretimi iş
/// transaction'ı içinde atomik UPDATE ... RETURNING ile artırılır.
///
/// Bu bir sistem altyapı tablosudur — iş entity'si değildir. Bu yüzden
/// <see cref="Platform.Domain.Entities.Common.IAuditableEntity"/> /
/// <see cref="Platform.Domain.Entities.Common.IOwnedEntity"/> /
/// <see cref="Platform.Domain.Entities.Common.ISoftDeleteEntity"/> marker'larını
/// implemente ETMEZ; audit/soft-delete/owner filtreleri buna uygulanmaz.
/// </summary>
public class NumberCounter
{
    public int Id { get; set; }

    /// <summary>Doküman tipi anahtarı (örn. "PURCHASE_ORDER"). Case-insensitive normalize edilir.</summary>
    public string DocumentType { get; set; } = default!;

    public CounterResetPeriod ResetPeriod { get; set; }

    /// <summary>Periyot anahtarı: "ALL", "2026", "2026-05", "2026-Q4".</summary>
    public string PeriodKey { get; set; } = default!;

    /// <summary>Bu periyotta verilmiş son numara.</summary>
    public long LastValue { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
