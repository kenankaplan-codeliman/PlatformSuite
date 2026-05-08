using Platform.Application.Common.Abstractions;

namespace Crm.Application.Features.Contacts.Commands.DeleteContact;

public sealed record DeleteContactCommand(List<Guid> Ids) : ICommand;
