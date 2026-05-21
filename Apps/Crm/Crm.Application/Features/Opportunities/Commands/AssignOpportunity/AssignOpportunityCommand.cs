using Platform.Application.Common.Abstractions;

namespace Crm.Application.Features.Opportunities.Commands.AssignOpportunity;

public sealed record AssignOpportunityCommand(List<Guid> Ids, Guid OwnerId) : ICommand;
