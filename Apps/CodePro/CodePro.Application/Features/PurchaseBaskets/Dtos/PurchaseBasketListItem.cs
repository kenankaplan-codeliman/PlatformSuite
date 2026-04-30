using CodePro.Domain.Enums;

namespace CodePro.Application.Features.PurchaseBaskets.Dtos;

public class PurchaseBasketListItem
{
    public Guid Id { get; set; }
    public PurchaseBasketStatus Status { get; set; }
    public Guid? PurchaseRequestId { get; set; }
    public int LineCount { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
