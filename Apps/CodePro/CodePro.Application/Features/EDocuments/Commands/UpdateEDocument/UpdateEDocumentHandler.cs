using CodePro.Application.Features.EDocuments.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;

namespace CodePro.Application.Features.EDocuments.Commands.UpdateEDocument;

public sealed class UpdateEDocumentHandler : IRequestHandler<UpdateEDocumentCommand, Result<EDocumentDetailItem>>
{
    private readonly IEDocumentRepository _repository;

    public UpdateEDocumentHandler(IEDocumentRepository repository) => _repository = repository;

    public async Task<Result<EDocumentDetailItem>> Handle(UpdateEDocumentCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return EDocumentErrors.NotFound;

        entity.Subject = request.Subject;
        entity.Description = request.Description;
        entity.DocumentType = request.DocumentType;
        entity.Status = request.Status;
        entity.EntityType = request.EntityType;
        entity.EntityId = request.EntityId;
        entity.AttachmentUrl = request.AttachmentUrl;
        entity.RoutingType = request.RoutingType;
        entity.RoutingGroups = request.RoutingGroups;
        entity.RoutingPersonIds = request.RoutingPersonIds;
        entity.RoutingPersonNames = request.RoutingPersonNames;

        await _repository.UpdateAsync(entity, cancellationToken);
        return entity.Adapt<EDocumentDetailItem>();
    }
}
