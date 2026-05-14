using Crm.Application.Features.Opportunities.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Modals.Common;

namespace Crm.Application.Features.Opportunities.Commands.UpdateOpportunity;

public sealed class UpdateOpportunityCommand : ICommand<OpportunityDetailItem>
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public EntityReference? Account { get; init; }
    public EntityReference? PrimaryContact { get; init; }
    public string Stage { get; init; } = "Prospecting";
    public decimal? Amount { get; init; }
    public int Probability { get; init; }
    public DateTime? CloseDate { get; init; }
    public string? LossReason { get; init; }
}
