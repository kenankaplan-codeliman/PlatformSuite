using Platform.Application.Common.Abstractions;

namespace Platform.Application.Features.Accounts.Commands.AssignAccount;

public sealed record AssignAccountCommand(List<Guid> Ids, Guid OwnerId) : ICommand;
