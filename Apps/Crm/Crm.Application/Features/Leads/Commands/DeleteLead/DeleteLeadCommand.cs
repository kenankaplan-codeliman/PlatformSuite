using Platform.Application.Common.Abstractions;

namespace Crm.Application.Features.Leads.Commands.DeleteLead;

public sealed record DeleteLeadCommand(Guid Id) : ICommand;
