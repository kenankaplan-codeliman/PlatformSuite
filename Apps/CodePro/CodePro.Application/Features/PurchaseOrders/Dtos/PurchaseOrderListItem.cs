using CodePro.Domain.Enums;

namespace CodePro.Application.Features.PurchaseOrders.Dtos;

public class PurchaseOrderListItem
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; } = default!;
    public string Title { get; set; } = default!;
    public Guid SupplierId { get; set; }
    public string? SupplierName { get; set; }
    public PurchaseOrderStatus Status { get; set; }
    public PurchaseOrderPriority Priority { get; set; }
    public DateTime OrderDate { get; set; }
    public decimal TotalAmount { get; set; }
    public string? CurrencyCode { get; set; }
    public int LineCount { get; set; }
    public bool IsActive { get; set; }
}
