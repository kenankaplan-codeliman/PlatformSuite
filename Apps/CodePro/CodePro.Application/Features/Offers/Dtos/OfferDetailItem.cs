using CodePro.Domain.Enums;

namespace CodePro.Application.Features.Offers.Dtos;

public class OfferDetailItem
{
    public Guid Id { get; set; }
    public string OfferNumber { get; set; } = default!;
    public OfferType OfferType { get; set; }
    public string Subject { get; set; } = default!;
    public string CounterpartyName { get; set; } = default!;
    public Guid? CounterpartyId { get; set; }
    public Guid ResponsibleUserId { get; set; }
    public DateOnly? ValidFrom { get; set; }
    public DateOnly ValidUntil { get; set; }
    public string Currency { get; set; } = "TRY";
    public decimal DiscountPercentage { get; set; }
    public decimal Subtotal { get; set; }
    public decimal VatTotal { get; set; }
    public decimal GrandTotal { get; set; }
    public string? Notes { get; set; }
    public OfferStatus Status { get; set; }
    public string? ResultReason { get; set; }
    public string? ResultReasonCategory { get; set; }
    public Guid? ConvertedContractId { get; set; }
    public DateTime? SentToCounterpartyAt { get; set; }
    public DateTime? ResultMarkedAt { get; set; }
    public bool IsActive { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public List<OfferItemItem> Items { get; set; } = new();
}

public class OfferItemItem
{
    public Guid Id { get; set; }
    public int OrderIndex { get; set; }
    public Guid? ProductId { get; set; }
    public string ProductName { get; set; } = default!;
    public decimal Quantity { get; set; }
    public OfferUnit Unit { get; set; }
    public decimal UnitPrice { get; set; }
    public OfferVatRate VatRate { get; set; }
    public decimal LineTotal { get; set; }
    public decimal LineVat { get; set; }
}
