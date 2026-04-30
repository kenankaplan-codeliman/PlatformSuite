using CodePro.Application.Features.EDocuments.Dtos;
using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.EDocuments;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;

namespace CodePro.Application.Features.EDocuments.Commands.CreateEDocument;

public sealed class CreateEDocumentHandler : IRequestHandler<CreateEDocumentCommand, Result<EDocumentDetailItem>>
{
    private readonly IEDocumentRepository _repository;

    public CreateEDocumentHandler(IEDocumentRepository repository) => _repository = repository;

    public async Task<Result<EDocumentDetailItem>> Handle(CreateEDocumentCommand request, CancellationToken cancellationToken)
    {
        var entity = new EDocument
        {
            Subject = request.Subject,
            Description = request.Description,
            DocumentType = request.DocumentType,
            Status = request.Status,
            EntityType = request.EntityType,
            EntityId = request.EntityId,
            AttachmentUrl = request.AttachmentUrl,
            RoutingType = request.RoutingType,
            RoutingGroups = request.RoutingGroups,
            RoutingPersonIds = request.RoutingPersonIds,
            RoutingPersonNames = request.RoutingPersonNames,
        };
        await _repository.CreateAsync(entity, cancellationToken);

        return entity.Adapt<EDocumentDetailItem>();
    }
}
