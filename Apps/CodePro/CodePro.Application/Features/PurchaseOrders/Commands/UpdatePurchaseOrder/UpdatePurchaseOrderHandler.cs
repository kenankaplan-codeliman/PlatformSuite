using CodePro.Application.Features.PurchaseOrders.Dtos;
using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.PurchaseOrders;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.PurchaseOrders.Commands.UpdatePurchaseOrder;

public sealed class UpdatePurchaseOrderHandler : IRequestHandler<UpdatePurchaseOrderCommand, Result<PurchaseOrderDetailItem>>
{
    private readonly IPurchaseOrderRepository _repository;
    private readonly IAttachmentRepository _attachmentRepository;
    private readonly ICodeProDbContext _db;

    public UpdatePurchaseOrderHandler(
        IPurchaseOrderRepository repository,
        IAttachmentRepository attachmentRepository,
        ICodeProDbContext db)
    {
        _repository = repository;
        _attachmentRepository = attachmentRepository;
        _db = db;
    }

    public async Task<Result<PurchaseOrderDetailItem>> Handle(UpdatePurchaseOrderCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return PurchaseOrderErrors.NotFound;

        var supplierId = request.Supplier?.Id ?? Guid.Empty;
        var supplierExists = await _db.Supplier.AsNoTracking().AnyAsync(a => a.Id == supplierId, cancellationToken);
        if (!supplierExists) return PurchaseOrderErrors.SupplierNotFound;

        var numberExists = await _db.PurchaseOrder.AsNoTracking()
            .AnyAsync(p => p.Id != request.Id && p.OrderNumber.ToLower() == request.OrderNumber.ToLower(), cancellationToken);
        if (numberExists) return PurchaseOrderErrors.DuplicateOrderNumber;

        entity.OrderNumber = request.OrderNumber;
        entity.Title = request.Title;
        entity.Description = request.Description;
        entity.SupplierId = supplierId;
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

        if (request.Attachments.Count > 0)
        {
            var metadataIds = request.Attachments.Select(a => a.MetadataId).ToList();
            await _attachmentRepository.AssociateAsync(metadataIds, entity.Id, nameof(PurchaseOrder), cancellationToken);
        }

        var detail = await PurchaseOrderDetailBuilder.BuildAsync(_db, entity.Id, cancellationToken);
        if (detail is null) return PurchaseOrderErrors.NotFound;
        return detail;
    }
}
