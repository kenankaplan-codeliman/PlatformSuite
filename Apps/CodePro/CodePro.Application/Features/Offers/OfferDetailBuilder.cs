using CodePro.Application.Features.Offers.Dtos;
using CodePro.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Offers;

internal static class OfferDetailBuilder
{
    public static async Task<OfferDetailItem?> BuildAsync(ICodeProDbContext db, Guid id, CancellationToken cancellationToken)
    {
        var detail = await db.Offer.AsNoTracking()
            .Where(o => o.Id == id)
            .Select(o => new OfferDetailItem
            {
                Id = o.Id,
                OfferNumber = o.OfferNumber,
                OfferType = o.OfferType,
                Subject = o.Subject,
                CounterpartyName = o.CounterpartyName,
                CounterpartyId = o.CounterpartyId,
                ResponsibleUserId = o.ResponsibleUserId,
                ValidFrom = o.ValidFrom,
                ValidUntil = o.ValidUntil,
                Currency = o.Currency,
                DiscountPercentage = o.DiscountPercentage,
                Subtotal = o.Subtotal,
                VatTotal = o.VatTotal,
                GrandTotal = o.GrandTotal,
                Notes = o.Notes,
                Status = o.Status,
                ResultReason = o.ResultReason,
                ResultReasonCategory = o.ResultReasonCategory,
                ConvertedContractId = o.ConvertedContractId,
                SentToCounterpartyAt = o.SentToCounterpartyAt,
                ResultMarkedAt = o.ResultMarkedAt,
                IsActive = o.IsActive,
                CreatedAt = o.CreatedAt,
                UpdatedAt = o.UpdatedAt,
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (detail is null) return null;

        detail.Items = await db.OfferItem.AsNoTracking()
            .Where(i => i.OfferId == id)
            .OrderBy(i => i.OrderIndex)
            .Select(i => new OfferItemItem
            {
                Id = i.Id,
                OrderIndex = i.OrderIndex,
                ProductId = i.ProductId,
                ProductName = i.ProductName,
                Quantity = i.Quantity,
                Unit = i.Unit,
                UnitPrice = i.UnitPrice,
                VatRate = i.VatRate,
                LineTotal = i.LineTotal,
                LineVat = i.LineVat,
            })
            .ToListAsync(cancellationToken);

        return detail;
    }
}
