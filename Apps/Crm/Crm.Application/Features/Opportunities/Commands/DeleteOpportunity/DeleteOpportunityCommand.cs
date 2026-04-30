using Platform.Application.Common.Abstractions;

namespace Crm.Application.Features.Opportunities.Commands.DeleteOpportunity;

public sealed record DeleteOpportunityCommand(Guid Id) : ICommand;
