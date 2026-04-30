using CodePro.Application.Features.PurchaseRequests.Dtos;
using CodePro.Domain.Enums;
using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.PurchaseRequests.Commands.CreatePurchaseRequest;

public sealed class CreatePurchaseRequestCommand : ICommand<PurchaseRequestDetailItem>
{
    public string? RequestNumber { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? Description { get; init; }
    public PurchaseRequestPriority Priority { get; init; } = PurchaseRequestPriority.Medium;
    public DateTime RequestDate { get; init; } = DateTime.UtcNow;
    public DateTime? RequiredDate { get; init; }
    public string? CurrencyCode { get; init; }
    public List<PurchaseRequestLineItem> Lines { get; init; } = new();
}
