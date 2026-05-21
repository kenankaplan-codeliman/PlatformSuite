using Platform.Application.Common.Abstractions;

namespace Crm.Application.Features.Opportunities.Commands.SetStateOpportunity;

public sealed record SetStateOpportunityCommand(List<Guid> Ids, bool IsActive) : ICommand;
