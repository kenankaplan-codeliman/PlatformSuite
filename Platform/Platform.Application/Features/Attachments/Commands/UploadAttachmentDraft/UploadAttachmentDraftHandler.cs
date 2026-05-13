using Platform.Application.Common.Results;
using Platform.Application.Features.Attachments.Dtos;
using Platform.Application.Interfaces;
using Mapster;
using MediatR;

namespace Platform.Application.Features.Attachments.Commands.UploadAttachmentDraft;

public sealed class UploadAttachmentDraftHandler : IRequestHandler<UploadAttachmentDraftCommand, Result<AttachmentMetadataItem>>
{
    /// <summary>Default TTL for un-associated draft attachments.</summary>
    private static readonly TimeSpan DraftLifetime = TimeSpan.FromHours(24);

    private readonly IAttachmentRepository _repository;

    public UploadAttachmentDraftHandler(IAttachmentRepository repository) => _repository = repository;

    public async Task<Result<AttachmentMetadataItem>> Handle(UploadAttachmentDraftCommand request, CancellationToken cancellationToken)
    {
        if (request.DataBytes is null || request.DataBytes.Length == 0)
            return AttachmentErrors.EmptyFile;

        var metadata = await _repository.CreateDraftAsync(
            request.DataBytes,
            request.FileName,
            request.ContentType,
            request.FileSize,
            request.DocumentType,
            request.Subject,
            request.Description,
            DateTime.UtcNow.Add(DraftLifetime),
            cancellationToken);

        return metadata.Adapt<AttachmentMetadataItem>();
    }
}
