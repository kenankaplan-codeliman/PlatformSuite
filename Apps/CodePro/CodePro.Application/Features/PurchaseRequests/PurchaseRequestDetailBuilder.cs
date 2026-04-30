using CodePro.Application.Features.PurchaseRequests.Dtos;
using CodePro.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.PurchaseRequests;

internal static class PurchaseRequestDetailBuilder
{
    public static async Task<PurchaseRequestDetailItem?> BuildAsync(ICodeProDbContext db, Guid id, CancellationToken cancellationToken)
    {
        var detail = await db.PurchaseRequest.AsNoTracking()
            .Where(p => p.Id == id)
            .Select(p => new PurchaseRequestDetailItem
            {
                Id = p.Id,
                RequestNumber = p.RequestNumber,
                Title = p.Title,
                Description = p.Description,
                Status = p.Status,
                Priority = p.Priority,
                RequestDate = p.RequestDate,
                RequiredDate = p.RequiredDate,
                CurrencyCode = p.CurrencyCode,
                TotalAmount = p.TotalAmount,
                IsActive = p.IsActive,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (detail is null) return null;

        detail.Lines = await (
            from l in db.PurchaseRequestLine.AsNoTracking()
            where l.PurchaseRequestId == id
            orderby l.CreatedAt
            select new PurchaseRequestLineItem
            {
                Id = l.Id,
                IsFreeProduct = l.IsFreeProduct,
                ProductId = l.ProductId,
                ProductName = l.ProductName,
                SupplierAccountId = l.SupplierAccountId,
                SupplierAccountName = l.SupplierAccountId.HasValue
                    ? db.Account.Where(a => a.Id == l.SupplierAccountId).Select(a => a.AccountName).FirstOrDefault()
                    : null,
                Quantity = l.Quantity,
                UnitOfMeasure = l.UnitOfMeasure,
                UnitPrice = l.UnitPrice,
                Currency = l.Currency,
                TotalAmount = l.TotalAmount,
                NeedByDate = l.NeedByDate,
                BuyerNotes = l.BuyerNotes,
                Status = l.Status,
            }
        ).ToListAsync(cancellationToken);

        return detail;
    }
}
