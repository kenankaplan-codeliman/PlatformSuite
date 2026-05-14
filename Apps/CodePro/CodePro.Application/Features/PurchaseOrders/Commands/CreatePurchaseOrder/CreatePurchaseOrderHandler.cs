using CodePro.Application.Features.PurchaseOrders.Dtos;
using CodePro.Application.Interfaces;
using CodePro.Domain.Constants;
using CodePro.Domain.Entities.PurchaseOrders;
using CodePro.Domain.Enums;
using Platform.Application.Common.Numbering;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.PurchaseOrders.Commands.CreatePurchaseOrder;

public sealed class CreatePurchaseOrderHandler : IRequestHandler<CreatePurchaseOrderCommand, Result<PurchaseOrderDetailItem>>
{
    private readonly IPurchaseOrderRepository _repository;
    private readonly IAttachmentRepository _attachmentRepository;
    private readonly ICodeProDbContext _db;
    private readonly INumberGeneratorService _numberGenerator;

    public CreatePurchaseOrderHandler(
        IPurchaseOrderRepository repository,
        IAttachmentRepository attachmentRepository,
        ICodeProDbContext db,
        INumberGeneratorService numberGenerator)
    {
        _repository = repository;
        _attachmentRepository = attachmentRepository;
        _db = db;
        _numberGenerator = numberGenerator;
    }

    public async Task<Result<PurchaseOrderDetailItem>> Handle(CreatePurchaseOrderCommand request, CancellationToken cancellationToken)
    {
        var supplierId = request.Supplier?.Id ?? Guid.Empty;
        var supplierExists = await _db.Supplier.AsNoTracking().AnyAsync(a => a.Id == supplierId, cancellationToken);
        if (!supplierExists) return PurchaseOrderErrors.SupplierNotFound;

        var orderNumber = string.IsNullOrWhiteSpace(request.OrderNumber)
            ? await _numberGenerator.GenerateAsync(CodeProDocumentTypes.PurchaseOrder, ct: cancellationToken)
            : request.OrderNumber.Trim();

        var numberExists = await _db.PurchaseOrder.AsNoTracking()
            .AnyAsync(p => p.OrderNumber.ToLower() == orderNumber.ToLower(), cancellationToken);
        if (numberExists) return PurchaseOrderErrors.DuplicateOrderNumber;

        var entity = new PurchaseOrder
        {
            OrderNumber = orderNumber,
            Title = request.Title,
            Description = request.Description,
            SupplierId = supplierId,
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
