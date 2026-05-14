using CodePro.Domain.Constants;
using Platform.Application.Common.Numbering;
using Platform.Domain.Enums;

namespace CodePro.Application.Common.Numbering.Strategies;

/// <summary>
/// Satın alma siparişi numara formatı: <c>PO-{yıl}-{sıra:D4}</c> (örn. "PO-2026-0001").
/// Mevcut PurchaseOrder numara formatıyla birebir uyumludur.
/// </summary>
public sealed class PurchaseOrderNumberStrategy : INumberFormatStrategy
{
    public string DocumentType => CodeProDocumentTypes.PurchaseOrder;

    public CounterResetPeriod ResetPeriod => CounterResetPeriod.Yearly;

    public string Format(NumberFormatContext ctx) =>
        $"PO-{ctx.GeneratedAt.Year}-{ctx.Sequence:D4}";
}
