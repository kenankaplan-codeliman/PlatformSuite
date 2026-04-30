using Platform.Application.Common.Abstractions;

namespace Platform.Application.Features.Contacts.Commands.DeleteContact;

public sealed record DeleteContactCommand(List<Guid> Ids) : ICommand;
