using Platform.Application.Common.Abstractions;
using Crm.Domain.Enums;

namespace Crm.Application.Features.Contacts.Commands.BulkUpdateStatusContact;

public sealed record BulkUpdateStatusContactCommand(List<Guid> Ids, ContactStatus Status) : ICommand;
