using Platform.Application.Common.Abstractions;
using Platform.Domain.Enums;

namespace Platform.Application.Features.Accounts.Commands.BulkUpdateStatusAccount;

public sealed record BulkUpdateStatusAccountCommand(List<Guid> Ids, AccountStatus Status) : ICommand;
