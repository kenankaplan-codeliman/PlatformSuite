using CRM.Domain.Enums;

namespace CRM.Application.Modals.OpportunityModal;

public class OpportunityProductItem
{
    public Guid Id { get; set; }

    public Guid ProductId { get; set; }

    public string? ProductName { get; set; }
}