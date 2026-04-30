using CodePro.Domain.Enums;

namespace CodePro.Application.Features.PurchaseRequests.Dtos;

public class PurchaseRequestDetailItem
{
    public Guid Id { get; set; }
    public string RequestNumber { get; set; } = default!;
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
    public PurchaseRequestStatus Status { get; set; }
    public PurchaseRequestPriority Priority { get; set; }
    public DateTime RequestDate { get; set; }
    public DateTime? RequiredDate { get; set; }
    public string? CurrencyCode { get; set; }
    public decimal TotalAmount { get; set; }
    public bool IsActive { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<PurchaseRequestLineItem> Lines { get; set; } = new();
}

public class PurchaseRequestLineItem
{
    public Guid Id { get; set; }
    public bool IsFreeProduct { get; set; }
    public Guid? ProductId { get; set; }
    public string? ProductName { get; set; }
    public Guid? SupplierAccountId { get; set; }
    public string? SupplierAccountName { get; set; }
    public decimal Quantity { get; set; }
    public string? UnitOfMeasure { get; set; }
    public decimal? UnitPrice { get; set; }
    public string? Currency { get; set; }
    public decimal TotalAmount { get; set; }
    public DateTime? NeedByDate { get; set; }
    public string? BuyerNotes { get; set; }
    public PurchaseRequestLineStatus Status { get; set; }
}
