using Platform.Application.Common.Results;
using Platform.Application.Features.Attachments.Dtos;
using Platform.Application.Interfaces;
using Platform.Domain.Entities.Attachments;
using Mapster;
using MediatR;

namespace Platform.Application.Features.Attachments.Commands.UploadAttachment;

public sealed class UploadAttachmentHandler : IRequestHandler<UploadAttachmentCommand, Result<AttachmentMetadataItem>>
{
    private readonly IAttachmentRepository _repository;

    public UploadAttachmentHandler(IAttachmentRepository repository) => _repository = repository;

    public async Task<Result<AttachmentMetadataItem>> Handle(UploadAttachmentCommand request, CancellationToken cancellationToken)
    {
        if (request.DataBytes is null || request.DataBytes.Length == 0)
            return AttachmentErrors.EmptyFile;

        var fileData = new AttachmentFileData
        {
            Id = Guid.NewGuid(),
            DataBytes = request.DataBytes,
        };

        var metadata = new AttachmentFileMetadata
        {
            Id = Guid.NewGuid(),
            FileDataId = fileData.Id,
            FileName = request.FileName,
            ContentType = request.ContentType,
            FileSize = request.FileSize,
            DocumentType = request.DocumentType,
            Subject = request.Subject,
            Description = request.Description,
        };

        var relation = new AttachmentFileRelation
        {
            Id = Guid.NewGuid(),
            MetadataId = metadata.Id,
            EntityId = request.EntityId,
            EntityType = request.EntityType,
        };

        var saved = await _repository.SaveAsync(fileData, metadata, relation, cancellationToken);
        return saved.Adapt<AttachmentMetadataItem>();
    }
}
