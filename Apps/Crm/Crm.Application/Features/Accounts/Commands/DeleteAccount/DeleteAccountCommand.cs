using Platform.Application.Common.Abstractions;

namespace Crm.Application.Features.Accounts.Commands.DeleteAccount;

public sealed record DeleteAccountCommand(List<Guid> Ids) : ICommand;
