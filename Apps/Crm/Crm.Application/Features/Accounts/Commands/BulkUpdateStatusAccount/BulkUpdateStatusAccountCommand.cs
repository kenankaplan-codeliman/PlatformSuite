using Platform.Application.Common.Abstractions;
using Crm.Domain.Enums;

namespace Crm.Application.Features.Accounts.Commands.BulkUpdateStatusAccount;

public sealed record BulkUpdateStatusAccountCommand(List<Guid> Ids, AccountStatus Status) : ICommand;
