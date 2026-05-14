using Platform.Application.Common.Abstractions;

namespace Crm.Application.Features.Accounts.Commands.BulkUpdateStatusAccount;

public sealed record BulkUpdateStatusAccountCommand(List<Guid> Ids, string Status) : ICommand;
