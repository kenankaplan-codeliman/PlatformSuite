using Platform.Application.Common.Abstractions;
using Platform.Domain.Enums;

namespace Platform.Application.Features.Contacts.Commands.BulkUpdateStatusContact;

public sealed record BulkUpdateStatusContactCommand(List<Guid> Ids, ContactStatus Status) : ICommand;
