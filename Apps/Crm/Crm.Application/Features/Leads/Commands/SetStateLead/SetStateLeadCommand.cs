using Platform.Application.Common.Abstractions;

namespace Crm.Application.Features.Leads.Commands.SetStateLead;

public sealed record SetStateLeadCommand(List<Guid> Ids, bool IsActive) : ICommand;
