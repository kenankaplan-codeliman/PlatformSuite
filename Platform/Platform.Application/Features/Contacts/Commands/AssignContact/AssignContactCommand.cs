using Platform.Application.Common.Abstractions;

namespace Platform.Application.Features.Contacts.Commands.AssignContact;

public sealed record AssignContactCommand(List<Guid> Ids, Guid OwnerId) : ICommand;
