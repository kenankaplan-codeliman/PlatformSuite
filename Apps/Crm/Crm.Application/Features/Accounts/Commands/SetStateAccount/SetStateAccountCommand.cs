using Platform.Application.Common.Abstractions;

namespace Crm.Application.Features.Accounts.Commands.SetStateAccount;

public sealed record SetStateAccountCommand(List<Guid> Ids, bool IsActive) : ICommand;
