using CodePro.Domain.Enums;

namespace CodePro.Application.Features.PurchaseRequests.Dtos;

public class PurchaseRequestListFilter
{
    public string? Search { get; set; }
    public PurchaseRequestStatus? Status { get; set; }
    public PurchaseRequestPriority? Priority { get; set; }
    public bool? IsActive { get; set; }
}
