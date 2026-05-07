using CodePro.Application.Features.PurchaseOrders.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Modals.Common;
using Platform.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.PurchaseOrders;

internal static class PurchaseOrderDetailBuilder
{
    public static async Task<PurchaseOrderDetailItem?> BuildAsync(ICodeProDbContext db, Guid id, CancellationToken cancellationToken)
    {
        var detail = await db.PurchaseOrder.AsNoTracking()
            .Where(p => p.Id == id)
            .Select(p => new PurchaseOrderDetailItem
            {
                Id = p.Id,
                OrderNumber = p.OrderNumber,
                Title = p.Title,
                Description = p.Description,
                SupplierAccount = db.Account
                    .Where(a => a.Id == p.SupplierAccountId)
                    .Select(a => new EntityReference(EntityType.Account) { Id = a.Id, Name = a.AccountName })
                    .FirstOrDefault(),
                PurchaseRequestId = p.PurchaseRequestId,
                Status = p.Status,
                Priority = p.Priority,
                OrderDate = p.OrderDate,
                ExpectedDeliveryDate = p.ExpectedDeliveryDate,
                CurrencyCode = p.CurrencyCode,
                TotalAmount = p.TotalAmount,
                IsActive = p.IsActive,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (detail is null) return null;

        detail.Lines = await db.PurchaseOrderLine.AsNoTracking()
            .Where(l => l.PurchaseOrderId == id)
            .OrderBy(l => l.CreatedAt)
            .Select(l => new PurchaseOrderLineItem
            {
                Id = l.Id,
                PurchaseRequestLineId = l.PurchaseRequestLineId,
                IsFreeProduct = l.IsFreeProduct,
                ProductId = l.ProductId,
                ProductName = l.ProductName,
                Quantity = l.Quantity,
                UnitOfMeasure = l.UnitOfMeasure,
                UnitPrice = l.UnitPrice,
                Currency = l.Currency,
                TotalAmount = l.TotalAmount,
                NeedByDate = l.NeedByDate,
                BuyerNotes = l.BuyerNotes,
                Status = l.Status,
            })
            .ToListAsync(cancellationToken);

        return detail;
    }
}
