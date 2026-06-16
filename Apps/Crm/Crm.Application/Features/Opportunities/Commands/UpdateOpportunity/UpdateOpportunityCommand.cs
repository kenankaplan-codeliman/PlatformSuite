using Crm.Application.Features.Opportunities.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Attachments;
using Platform.Application.Modals.Common;

namespace Crm.Application.Features.Opportunities.Commands.UpdateOpportunity;

public sealed class UpdateOpportunityCommand : ICommand<OpportunityDetailItem>, IAttachmentCarrier
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public EntityReference? Account { get; init; }
    public EntityReference? PrimaryContact { get; init; }
    public string Stage { get; init; } = "Prospecting";
    public decimal? EstimatedAmount { get; init; }
    public string? Currency { get; init; }
    public int Probability { get; init; }
    public DateTime? CloseDate { get; init; }
    public string? LossReason { get; init; }
    public List<OpportunityProductModal> Products { get; init; } = new();
    public List<AttachmentAssociation> Attachments { get; init; } = new();
}
