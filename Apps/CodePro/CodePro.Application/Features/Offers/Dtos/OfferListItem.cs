using CodePro.Domain.Enums;

namespace CodePro.Application.Features.Offers.Dtos;

public class OfferListItem
{
    public Guid Id { get; set; }
    public string OfferNumber { get; set; } = default!;
    public OfferType OfferType { get; set; }
    public string Subject { get; set; } = default!;
    public string CounterpartyName { get; set; } = default!;
    public OfferStatus Status { get; set; }
    public DateOnly ValidUntil { get; set; }
    public string Currency { get; set; } = default!;
    public decimal GrandTotal { get; set; }
    public bool IsActive { get; set; }
}
