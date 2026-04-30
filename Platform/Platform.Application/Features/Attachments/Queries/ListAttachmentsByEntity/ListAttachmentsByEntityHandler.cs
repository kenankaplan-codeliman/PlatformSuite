using Platform.Application.Common.Results;
using Platform.Application.Features.Attachments.Dtos;
using Platform.Application.Interfaces;
using Mapster;
using MediatR;

namespace Platform.Application.Features.Attachments.Queries.ListAttachmentsByEntity;

public sealed class ListAttachmentsByEntityHandler : IRequestHandler<ListAttachmentsByEntityQuery, Result<List<AttachmentMetadataItem>>>
{
    private readonly IAttachmentRepository _repository;

    public ListAttachmentsByEntityHandler(IAttachmentRepository repository) => _repository = repository;

    public async Task<Result<List<AttachmentMetadataItem>>> Handle(ListAttachmentsByEntityQuery request, CancellationToken cancellationToken)
    {
        var items = await _repository.ListByEntityAsync(request.EntityId, request.EntityType, cancellationToken);
        return items.Adapt<List<AttachmentMetadataItem>>();
    }
}
