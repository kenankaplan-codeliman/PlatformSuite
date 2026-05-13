using CodePro.Application.Features.PurchaseOrders.Dtos;
using CodePro.Domain.Enums;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Attachments;
using Platform.Application.Modals.Common;

namespace CodePro.Application.Features.PurchaseOrders.Commands.CreatePurchaseOrder;

public sealed class CreatePurchaseOrderCommand : ICommand<PurchaseOrderDetailItem>, IAttachmentCarrier
{
    public string? OrderNumber { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? Description { get; init; }
    public EntityReference? Supplier { get; init; }
    public Guid? PurchaseRequestId { get; init; }
    public PurchaseOrderPriority Priority { get; init; } = PurchaseOrderPriority.Medium;
    public DateTime OrderDate { get; init; } = DateTime.UtcNow;
    public DateTime? ExpectedDeliveryDate { get; init; }
    public string? CurrencyCode { get; init; }
    public List<PurchaseOrderLineItem> Lines { get; init; } = new();
    public List<AttachmentAssociation> Attachments { get; init; } = new();
}
