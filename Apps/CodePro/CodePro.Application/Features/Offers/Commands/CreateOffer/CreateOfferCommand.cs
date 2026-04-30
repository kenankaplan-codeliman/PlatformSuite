using CodePro.Application.Features.Offers.Dtos;
using CodePro.Domain.Enums;
using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.Offers.Commands.CreateOffer;

public sealed class CreateOfferCommand : ICommand<OfferDetailItem>
{
    public string OfferNumber { get; init; } = string.Empty;
    public OfferType OfferType { get; init; }
    public string Subject { get; init; } = string.Empty;
    public string CounterpartyName { get; init; } = string.Empty;
    public Guid? CounterpartyId { get; init; }
    public Guid ResponsibleUserId { get; init; }
    public DateOnly? ValidFrom { get; init; }
    public DateOnly ValidUntil { get; init; }
    public string Currency { get; init; } = "TRY";
    public decimal DiscountPercentage { get; init; }
    public string? Notes { get; init; }
    public List<OfferItemItem> Items { get; init; } = new();
}
