using CodePro.Application.Features.PurchaseRequests.Dtos;
using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.PurchaseRequests;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.PurchaseRequests;

internal static class PurchaseRequestSyncHelper
{
    public static async Task SyncLinesAsync(
        ICodeProDbContext db,
        Guid requestId,
        IReadOnlyList<PurchaseRequestLineItem> incoming,
        CancellationToken cancellationToken)
    {
        var existing = await db.PurchaseRequestLine
            .Where(l => l.PurchaseRequestId == requestId)
            .ToListAsync(cancellationToken);

        var incomingByKey = incoming
            .Where(l => l.Id != Guid.Empty)
            .ToDictionary(l => l.Id, l => l);
        var existingByKey = existing.ToDictionary(l => l.Id, l => l);

        var toRemove = existing.Where(e => !incomingByKey.ContainsKey(e.Id)).ToList();
        if (toRemove.Count > 0) db.PurchaseRequestLine.RemoveRange(toRemove);

        foreach (var item in incoming)
        {
            var totalAmount = (item.UnitPrice ?? 0) * item.Quantity;
            if (item.Id != Guid.Empty && existingByKey.TryGetValue(item.Id, out var current))
            {
                current.IsFreeProduct = item.IsFreeProduct;
                current.ProductId = item.ProductId;
                current.ProductName = item.ProductName;
                current.SupplierId = item.SupplierId;
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
                db.PurchaseRequestLine.Add(new PurchaseRequestLine
                {
                    PurchaseRequestId = requestId,
                    IsFreeProduct = item.IsFreeProduct,
                    ProductId = item.ProductId,
                    ProductName = item.ProductName,
                    SupplierId = item.SupplierId,
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

    public static decimal CalculateHeaderTotal(IEnumerable<PurchaseRequestLineItem> lines)
        => lines.Sum(l => (l.UnitPrice ?? 0) * l.Quantity);
}
