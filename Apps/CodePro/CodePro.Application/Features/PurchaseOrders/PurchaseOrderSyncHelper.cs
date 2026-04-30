using CodePro.Application.Features.PurchaseOrders.Dtos;
using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.PurchaseOrders;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.PurchaseOrders;

internal static class PurchaseOrderSyncHelper
{
    public static async Task SyncLinesAsync(
        ICodeProDbContext db,
        Guid orderId,
        IReadOnlyList<PurchaseOrderLineItem> incoming,
        CancellationToken cancellationToken)
    {
        var existing = await db.PurchaseOrderLine
            .Where(l => l.PurchaseOrderId == orderId)
            .ToListAsync(cancellationToken);

        var incomingByKey = incoming
            .Where(l => l.Id != Guid.Empty)
            .ToDictionary(l => l.Id, l => l);
        var existingByKey = existing.ToDictionary(l => l.Id, l => l);

        var toRemove = existing.Where(e => !incomingByKey.ContainsKey(e.Id)).ToList();
        if (toRemove.Count > 0) db.PurchaseOrderLine.RemoveRange(toRemove);

        foreach (var item in incoming)
        {
            var totalAmount = (item.UnitPrice ?? 0) * item.Quantity;
            if (item.Id != Guid.Empty && existingByKey.TryGetValue(item.Id, out var current))
            {
                current.PurchaseRequestLineId = item.PurchaseRequestLineId;
                current.IsFreeProduct = item.IsFreeProduct;
                current.ProductId = item.ProductId;
                current.ProductName = item.ProductName;
                current.Quantity = item.Quantity;
                current.UnitOfMeasure = item.UnitOfMeasure;
                current.UnitPrice = item.UnitPrice;
                current.Currency = item.Currency;
                current.TotalAmount = totalAmount;
                current.NeedByDate = item.NeedByDate;
                current.BuyerNotes = item.BuyerNotes;
                current.Status = item.Status;
            }
            else
            {
                db.PurchaseOrderLine.Add(new PurchaseOrderLine
                {
                    PurchaseOrderId = orderId,
                    PurchaseRequestLineId = item.PurchaseRequestLineId,
                    IsFreeProduct = item.IsFreeProduct,
                    ProductId = item.ProductId,
                    ProductName = item.ProductName,
                    Quantity = item.Quantity,
                    UnitOfMeasure = item.UnitOfMeasure,
                    UnitPrice = item.UnitPrice,
                    Currency = item.Currency,
                    TotalAmount = totalAmount,
                    NeedByDate = item.NeedByDate,
                    BuyerNotes = item.BuyerNotes,
                    Status = item.Status,
                });
            }
        }
    }

    public static decimal CalculateHeaderTotal(IEnumerable<PurchaseOrderLineItem> lines)
        => lines.Sum(l => (l.UnitPrice ?? 0) * l.Quantity);
}
