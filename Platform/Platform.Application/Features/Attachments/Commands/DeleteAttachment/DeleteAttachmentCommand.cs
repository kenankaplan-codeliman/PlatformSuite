using Platform.Application.Common.Abstractions;

namespace Platform.Application.Features.Attachments.Commands.DeleteAttachment;

public sealed record DeleteAttachmentCommand(Guid Id) : ICommand;
