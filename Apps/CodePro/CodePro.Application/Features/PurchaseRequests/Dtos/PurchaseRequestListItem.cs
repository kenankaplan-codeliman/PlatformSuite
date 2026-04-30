using CodePro.Domain.Enums;

namespace CodePro.Application.Features.PurchaseRequests.Dtos;

public class PurchaseRequestListItem
{
    public Guid Id { get; set; }
    public string RequestNumber { get; set; } = default!;
    public string Title { get; set; } = default!;
    public PurchaseRequestStatus Status { get; set; }
    public PurchaseRequestPriority Priority { get; set; }
    public DateTime RequestDate { get; set; }
    public DateTime? RequiredDate { get; set; }
    public decimal TotalAmount { get; set; }
    public string? CurrencyCode { get; set; }
    public int LineCount { get; set; }
    public bool IsActive { get; set; }
}
