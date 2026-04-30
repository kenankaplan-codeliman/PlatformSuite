using CodePro.Application.Features.PurchaseOrders.Dtos;
using CodePro.Domain.Enums;
using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.PurchaseOrders.Commands.UpdatePurchaseOrder;

public sealed class UpdatePurchaseOrderCommand : ICommand<PurchaseOrderDetailItem>
{
    public Guid Id { get; init; }
    public string OrderNumber { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string? Description { get; init; }
    public Guid SupplierAccountId { get; init; }
    public Guid? PurchaseRequestId { get; init; }
    public PurchaseOrderStatus Status { get; init; }
    public PurchaseOrderPriority Priority { get; init; }
    public DateTime OrderDate { get; init; }
    public DateTime? ExpectedDeliveryDate { get; init; }
    public string? CurrencyCode { get; init; }
    public List<PurchaseOrderLineItem> Lines { get; init; } = new();
}
