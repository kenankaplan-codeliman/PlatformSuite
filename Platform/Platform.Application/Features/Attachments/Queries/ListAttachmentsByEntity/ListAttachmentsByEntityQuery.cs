using Platform.Application.Common.Abstractions;
using Platform.Application.Features.Attachments.Dtos;

namespace Platform.Application.Features.Attachments.Queries.ListAttachmentsByEntity;

public sealed class ListAttachmentsByEntityQuery : IQuery<List<AttachmentMetadataItem>>
{
    public Guid EntityId { get; init; }
    public string EntityType { get; init; } = string.Empty;
}
