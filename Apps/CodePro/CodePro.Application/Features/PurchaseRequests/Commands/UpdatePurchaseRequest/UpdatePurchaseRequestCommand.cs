using CodePro.Application.Features.PurchaseRequests.Dtos;
using CodePro.Domain.Enums;
using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.PurchaseRequests.Commands.UpdatePurchaseRequest;

public sealed class UpdatePurchaseRequestCommand : ICommand<PurchaseRequestDetailItem>
{
    public Guid Id { get; init; }
    public string RequestNumber { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string? Description { get; init; }
    public PurchaseRequestStatus Status { get; init; } = PurchaseRequestStatus.Setup;
    public PurchaseRequestPriority Priority { get; init; } = PurchaseRequestPriority.Medium;
    public DateTime RequestDate { get; init; }
    public DateTime? RequiredDate { get; init; }
    public string? CurrencyCode { get; init; }
    public List<PurchaseRequestLineItem> Lines { get; init; } = new();
}
