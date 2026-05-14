using CodePro.Domain.Constants;
using Platform.Application.Common.Numbering;
using Platform.Domain.Enums;

namespace CodePro.Application.Common.Numbering.Strategies;

/// <summary>
/// Teklif numara formatı: <c>TKL-{yıl}-{sıra:D4}</c> (örn. "TKL-2026-0001").
/// </summary>
public sealed class OfferNumberStrategy : INumberFormatStrategy
{
    public string DocumentType => CodeProDocumentTypes.Offer;

    public CounterResetPeriod ResetPeriod => CounterResetPeriod.Yearly;

    public string Format(NumberFormatContext ctx) =>
        $"TKL-{ctx.GeneratedAt.Year}-{ctx.Sequence:D4}";
}
