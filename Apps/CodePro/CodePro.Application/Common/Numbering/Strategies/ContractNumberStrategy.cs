using CodePro.Domain.Constants;
using Platform.Application.Common.Numbering;
using Platform.Domain.Enums;

namespace CodePro.Application.Common.Numbering.Strategies;

/// <summary>
/// Sözleşme numara formatı: <c>SZL-{yıl}-{sıra:D4}</c> (örn. "SZL-2026-0001").
/// </summary>
public sealed class ContractNumberStrategy : INumberFormatStrategy
{
    public string DocumentType => CodeProDocumentTypes.Contract;

    public CounterResetPeriod ResetPeriod => CounterResetPeriod.Yearly;

    public string Format(NumberFormatContext ctx) =>
        $"SZL-{ctx.GeneratedAt.Year}-{ctx.Sequence:D4}";
}
