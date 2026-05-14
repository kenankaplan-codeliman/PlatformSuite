using Platform.Application.Common.Abstractions;

namespace Crm.Application.Features.Contacts.Commands.BulkUpdateStatusContact;

public sealed record BulkUpdateStatusContactCommand(List<Guid> Ids, string Status) : ICommand;
