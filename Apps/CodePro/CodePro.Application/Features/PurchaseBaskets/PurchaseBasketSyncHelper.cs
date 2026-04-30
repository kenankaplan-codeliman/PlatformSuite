using CodePro.Application.Features.PurchaseBaskets.Dtos;
using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.PurchaseBaskets;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.PurchaseBaskets;

internal static class PurchaseBasketSyncHelper
{
    public static async Task SyncLinesAsync(
        ICodeProDbContext db,
        Guid basketId,
        IReadOnlyList<PurchaseBasketLineItem> incoming,
        CancellationToken cancellationToken)
    {
        var existing = await db.PurchaseBasketLine
            .Where(l => l.PurchaseBasketId == basketId)
            .ToListAsync(cancellationToken);

        var incomingByKey = incoming
            .Where(l => l.Id != Guid.Empty)
            .ToDictionary(l => l.Id, l => l);
        var existingByKey = existing.ToDictionary(l => l.Id, l => l);

        var toRemove = existing.Where(e => !incomingByKey.ContainsKey(e.Id)).ToList();
        if (toRemove.Count > 0) db.PurchaseBasketLine.RemoveRange(toRemove);

        foreach (var item in incoming)
        {
            if (item.Id != Guid.Empty && existingByKey.TryGetValue(item.Id, out var current))
            {
                current.ProductId = item.ProductId;
                current.Quantity = item.Quantity;
            }
            else
            {
                db.PurchaseBasketLine.Add(new PurchaseBasketLine
                {
                    PurchaseBasketId = basketId,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                });
            }
        }
    }
}
