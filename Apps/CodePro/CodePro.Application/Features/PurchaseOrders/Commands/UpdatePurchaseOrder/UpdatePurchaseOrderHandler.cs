using CodePro.Application.Features.PurchaseOrders.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.PurchaseOrders.Commands.UpdatePurchaseOrder;

public sealed class UpdatePurchaseOrderHandler : IRequestHandler<UpdatePurchaseOrderCommand, Result<PurchaseOrderDetailItem>>
{
    private readonly IPurchaseOrderRepository _repository;
    private readonly ICodeProDbContext _db;

    public UpdatePurchaseOrderHandler(IPurchaseOrderRepository repository, ICodeProDbContext db)
    {
        _repository = repository;
        _db = db;
    }

    public async Task<Result<PurchaseOrderDetailItem>> Handle(UpdatePurchaseOrderCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return PurchaseOrderErrors.NotFound;

        var supplierExists = await _db.Account.AsNoTracking().AnyAsync(a => a.Id == request.SupplierAccountId, cancellationToken);
        if (!supplierExists) return PurchaseOrderErrors.SupplierNotFound;

        var numberExists = await _db.PurchaseOrder.AsNoTracking()
            .AnyAsync(p => p.Id != request.Id && p.OrderNumber.ToLower() == request.OrderNumber.ToLower(), cancellationToken);
        if (numberExists) return PurchaseOrderErrors.DuplicateOrderNumber;

        entity.OrderNumber = request.OrderNumber;
        entity.Title = request.Title;
        entity.Description = request.Description;
        entity.SupplierAccountId = request.SupplierAccountId;
        entity.PurchaseRequestId = request.PurchaseRequestId;
        entity.Status = request.Status;
        entity.Priority = request.Priority;
        entity.OrderDate = request.OrderDate;
        entity.ExpectedDeliveryDate = request.ExpectedDeliveryDate;
        entity.CurrencyCode = request.CurrencyCode;
        entity.TotalAmount = PurchaseOrderSyncHelper.CalculateHeaderTotal(request.Lines);

        await _repository.UpdateAsync(entity, cancellationToken);

        await PurchaseOrderSyncHelper.SyncLinesAsync(_db, entity.Id, request.Lines, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        var detail = await PurchaseOrderDetailBuilder.BuildAsync(_db, entity.Id, cancellationToken);
        if (detail is null) return PurchaseOrderErrors.NotFound;
        return detail;
    }
}
