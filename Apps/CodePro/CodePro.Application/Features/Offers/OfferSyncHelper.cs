using CodePro.Application.Features.Offers.Dtos;
using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Offers;
using CodePro.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Offers;

internal static class OfferSyncHelper
{
    public static async Task SyncItemsAsync(
        ICodeProDbContext db,
        Guid offerId,
        IReadOnlyList<OfferItemItem> incoming,
        CancellationToken cancellationToken)
    {
        var existing = await db.OfferItem
            .Where(i => i.OfferId == offerId)
            .ToListAsync(cancellationToken);

        var incomingByKey = incoming
            .Where(l => l.Id != Guid.Empty)
            .ToDictionary(l => l.Id, l => l);
        var existingByKey = existing.ToDictionary(l => l.Id, l => l);

        var toRemove = existing.Where(e => !incomingByKey.ContainsKey(e.Id)).ToList();
        if (toRemove.Count > 0) db.OfferItem.RemoveRange(toRemove);

        foreach (var item in incoming)
        {
            var lineTotal = item.UnitPrice * item.Quantity;
            var vatPct = VatRatePercent(item.VatRate);
            var lineVat = lineTotal * vatPct / 100m;

            if (item.Id != Guid.Empty && existingByKey.TryGetValue(item.Id, out var current))
            {
                current.OrderIndex = item.OrderIndex;
                current.ProductId = item.ProductId;
                current.ProductName = item.ProductName;
                current.Quantity = item.Quantity;
                current.Unit = item.Unit;
                current.UnitPrice = item.UnitPrice;
                current.VatRate = item.VatRate;
                current.LineTotal = lineTotal;
                current.LineVat = lineVat;
            }
            else
            {
                db.OfferItem.Add(new OfferItem
                {
                    OfferId = offerId,
                    OrderIndex = item.OrderIndex,
                    ProductId = item.ProductId,
                    ProductName = item.ProductName,
                    Quantity = item.Quantity,
                    Unit = item.Unit,
                    UnitPrice = item.UnitPrice,
                    VatRate = item.VatRate,
                    LineTotal = lineTotal,
                    LineVat = lineVat,
                });
            }
        }
    }

    public static (decimal Subtotal, decimal Vat, decimal Grand) CalculateTotals(
        IEnumerable<OfferItemItem> lines,
        decimal discountPercentage)
    {
        decimal subtotal = 0;
        decimal vat = 0;
        foreach (var l in lines)
        {
            var lineTotal = l.UnitPrice * l.Quantity;
            var pct = VatRatePercent(l.VatRate);
            var lineVat = lineTotal * pct / 100m;
            subtotal += lineTotal;
            vat += lineVat;
        }
        var discount = subtotal * (discountPercentage / 100m);
        var afterDiscount = subtotal - discount;
        var grand = afterDiscount + vat;
        return (subtotal, vat, grand);
    }

    private static decimal VatRatePercent(OfferVatRate rate) => rate switch
    {
        OfferVatRate.Zero => 0m,
        OfferVatRate.One => 1m,
        OfferVatRate.Ten => 10m,
        OfferVatRate.Twenty => 20m,
        _ => 0m,
    };
}
