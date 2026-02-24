using CRM.Domain.Enums;

namespace CRM.Application.Modals.OpportunityModal;

public class OpportunityProductItem
{
    public Guid Id { get; set; }

    public Guid ProductId { get; set; }

    public string? ProductName { get; set; }

    public int Quantity { get; set; }

    public decimal UnitPrice { get; set; }

    public decimal DiscountPercent { get; set; }

    public decimal DiscountAmount { get; set; }

    public string? Description { get; set; }

    public decimal? TotalPrice { get; set; }
}