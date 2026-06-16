using Crm.Domain.Constants;
using Platform.Application.Common.Numbering;
using Platform.Domain.Enums;

namespace Crm.Application.Common.Numbering.Strategies;

/// <summary>
/// Fırsat kodu formatı: <c>FRS-{yıl}-{sıra:D4}</c> (örn. "FRS-2026-0001").
/// Sayaç her yıl sıfırlanır; numara create sırasında otomatik üretilir,
/// kullanıcı müdahalesi yoktur.
/// </summary>
public sealed class OpportunityCodeStrategy : INumberFormatStrategy
{
    public string DocumentType => CrmDocumentTypes.Opportunity;

    public CounterResetPeriod ResetPeriod => CounterResetPeriod.Yearly;

    public string Format(NumberFormatContext ctx) =>
        $"FRS-{ctx.GeneratedAt.Year}-{ctx.Sequence:D4}";
}
