using CodePro.Application.Features.PurchaseBaskets.Dtos;
using CodePro.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.PurchaseBaskets;

internal static class PurchaseBasketDetailBuilder
{
    public static async Task<PurchaseBasketDetailItem?> BuildAsync(ICodeProDbContext db, Guid id, CancellationToken cancellationToken)
    {
        var detail = await db.PurchaseBasket.AsNoTracking()
            .Where(b => b.Id == id)
            .Select(b => new PurchaseBasketDetailItem
            {
                Id = b.Id,
                Status = b.Status,
                PurchaseRequestId = b.PurchaseRequestId,
                IsActive = b.IsActive,
                CreatedAt = b.CreatedAt,
                UpdatedAt = b.UpdatedAt,
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (detail is null) return null;

        detail.Lines = await (
            from l in db.PurchaseBasketLine.AsNoTracking()
            join p in db.Product.AsNoTracking() on l.ProductId equals p.Id
            where l.PurchaseBasketId == id
            select new PurchaseBasketLineItem
            {
                Id = l.Id,
                ProductId = p.Id,
                ProductCode = p.Code,
                ProductName = p.Name,
                Quantity = l.Quantity,
            }
        ).ToListAsync(cancellationToken);

        return detail;
    }
}
