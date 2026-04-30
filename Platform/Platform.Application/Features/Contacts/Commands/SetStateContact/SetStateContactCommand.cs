using Platform.Application.Common.Abstractions;

namespace Platform.Application.Features.Contacts.Commands.SetStateContact;

public sealed record SetStateContactCommand(List<Guid> Ids, bool IsActive) : ICommand;
