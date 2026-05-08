using CodePro.Domain.Enums;

namespace CodePro.Application.Features.PurchaseOrders.Dtos;

public class PurchaseOrderListFilter
{
    public string? Search { get; set; }
    public PurchaseOrderStatus? Status { get; set; }
    public PurchaseOrderPriority? Priority { get; set; }
    public Guid? SupplierId { get; set; }
    public bool? IsActive { get; set; }
}
