using CodePro.Domain.Enums;
using Platform.Application.Modals.Common;

namespace CodePro.Application.Features.PurchaseOrders.Dtos;

public class PurchaseOrderDetailItem
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; } = default!;
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
    public EntityReference? SupplierAccount { get; set; }
    public Guid? PurchaseRequestId { get; set; }
    public PurchaseOrderStatus Status { get; set; }
    public PurchaseOrderPriority Priority { get; set; }
    public DateTime OrderDate { get; set; }
    public DateTime? ExpectedDeliveryDate { get; set; }
    public string? CurrencyCode { get; set; }
    public decimal TotalAmount { get; set; }
    public bool IsActive { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<PurchaseOrderLineItem> Lines { get; set; } = new();
}

public class PurchaseOrderLineItem
{
    public Guid Id { get; set; }
    public Guid? PurchaseRequestLineId { get; set; }
    public bool IsFreeProduct { get; set; }
    public Guid? ProductId { get; set; }
    public string? ProductName { get; set; }
    public decimal Quantity { get; set; }
    public string? UnitOfMeasure { get; set; }
    public decimal? UnitPrice { get; set; }
    public string? Currency { get; set; }
    public decimal TotalAmount { get; set; }
    public DateTime? NeedByDate { get; set; }
    public string? BuyerNotes { get; set; }
    public PurchaseOrderLineStatus Status { get; set; }
}
