using CodePro.Application.Features.PurchaseOrders.Dtos;
using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.PurchaseOrders;
using CodePro.Domain.Enums;
using Platform.Application.Common.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.PurchaseOrders.Commands.CreatePurchaseOrder;

public sealed class CreatePurchaseOrderHandler : IRequestHandler<CreatePurchaseOrderCommand, Result<PurchaseOrderDetailItem>>
{
    private readonly IPurchaseOrderRepository _repository;
    private readonly ICodeProDbContext _db;

    public CreatePurchaseOrderHandler(IPurchaseOrderRepository repository, ICodeProDbContext db)
    {
        _repository = repository;
        _db = db;
    }

    public async Task<Result<PurchaseOrderDetailItem>> Handle(CreatePurchaseOrderCommand request, CancellationToken cancellationToken)
    {
        var supplierId = request.SupplierAccount?.Id ?? Guid.Empty;
        var supplierExists = await _db.Account.AsNoTracking().AnyAsync(a => a.Id == supplierId, cancellationToken);
        if (!supplierExists) return PurchaseOrderErrors.SupplierNotFound;

        var orderNumber = string.IsNullOrWhiteSpace(request.OrderNumber)
            ? await GenerateOrderNumberAsync(cancellationToken)
            : request.OrderNumber.Trim();

        var numberExists = await _db.PurchaseOrder.AsNoTracking()
            .AnyAsync(p => p.OrderNumber.ToLower() == orderNumber.ToLower(), cancellationToken);
        if (numberExists) return PurchaseOrderErrors.DuplicateOrderNumber;

        var entity = new PurchaseOrder
        {
            OrderNumber = orderNumber,
            Title = request.Title,
            Description = request.Description,
            SupplierAccountId = supplierId,
            PurchaseRequestId = request.PurchaseRequestId,
            Priority = request.Priority,
            Status = PurchaseOrderStatus.Draft,
            OrderDate = request.OrderDate,
            ExpectedDeliveryDate = request.ExpectedDeliveryDate,
            CurrencyCode = request.CurrencyCode,
            TotalAmount = PurchaseOrderSyncHelper.CalculateHeaderTotal(request.Lines),
        };
        await _repository.CreateAsync(entity, cancellationToken);

        if (request.Lines.Count > 0)
        {
            await PurchaseOrderSyncHelper.SyncLinesAsync(_db, entity.Id, request.Lines, cancellationToken);
            await _db.SaveChangesAsync(cancellationToken);
        }

        var detail = await PurchaseOrderDetailBuilder.BuildAsync(_db, entity.Id, cancellationToken);
        if (detail is null) return PurchaseOrderErrors.NotFound;
        return detail;
    }

    private async Task<string> GenerateOrderNumberAsync(CancellationToken cancellationToken)
    {
        var year = DateTime.UtcNow.Year;
        var prefix = $"PO-{year}-";
        var lastNumber = await _db.PurchaseOrder.AsNoTracking()
            .Where(p => p.OrderNumber.StartsWith(prefix))
            .OrderByDescending(p => p.OrderNumber)
            .Select(p => p.OrderNumber)
            .FirstOrDefaultAsync(cancellationToken);

        var nextNumber = 1;
        if (!string.IsNullOrEmpty(lastNumber))
        {
            var suffix = lastNumber.Substring(prefix.Length);
            if (int.TryParse(suffix, out var n)) nextNumber = n + 1;
        }
        return $"{prefix}{nextNumber:D4}";
    }
}
