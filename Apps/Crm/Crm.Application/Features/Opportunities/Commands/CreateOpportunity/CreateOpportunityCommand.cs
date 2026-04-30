using Crm.Application.Features.Opportunities.Dtos;
using Crm.Domain.Enums;
using Platform.Application.Common.Abstractions;

namespace Crm.Application.Features.Opportunities.Commands.CreateOpportunity;

public sealed class CreateOpportunityCommand : ICommand<OpportunityDetailItem>
{
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public Guid AccountId { get; init; }
    public Guid? PrimaryContactId { get; init; }
    public OpportunityStage Stage { get; init; } = OpportunityStage.Prospecting;
    public decimal? Amount { get; init; }
    public int Probability { get; init; }
    public DateTime? CloseDate { get; init; }
    public string? LossReason { get; init; }
}
