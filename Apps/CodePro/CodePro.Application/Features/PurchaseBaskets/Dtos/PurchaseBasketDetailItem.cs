using CodePro.Domain.Enums;

namespace CodePro.Application.Features.PurchaseBaskets.Dtos;

public class PurchaseBasketDetailItem
{
    public Guid Id { get; set; }
    public PurchaseBasketStatus Status { get; set; }
    public Guid? PurchaseRequestId { get; set; }
    public bool IsActive { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<PurchaseBasketLineItem> Lines { get; set; } = new();
}

public class PurchaseBasketLineItem
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string? ProductCode { get; set; }
    public string? ProductName { get; set; }
    public int Quantity { get; set; }
}
