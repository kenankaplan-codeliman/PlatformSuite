using Platform.Application.Features.Attachments.Dtos;
using Platform.Domain.Entities.Attachments;
using Mapster;

namespace Platform.Application.Features.Attachments;

public static class AttachmentMappings
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<AttachmentFileMetadata, AttachmentMetadataItem>();
    }
}
