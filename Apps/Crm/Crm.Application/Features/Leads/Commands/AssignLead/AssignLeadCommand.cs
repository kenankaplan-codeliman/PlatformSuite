using Platform.Application.Common.Abstractions;

namespace Crm.Application.Features.Leads.Commands.AssignLead;

public sealed record AssignLeadCommand(List<Guid> Ids, Guid OwnerId) : ICommand;
