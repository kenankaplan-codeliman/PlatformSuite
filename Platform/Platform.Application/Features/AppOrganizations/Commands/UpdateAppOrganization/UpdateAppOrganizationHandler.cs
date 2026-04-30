using Platform.Application.Common.Results;
using Platform.Application.Features.AppOrganizations.Dtos;
using Platform.Application.Interfaces;
using Mapster;
using MediatR;

namespace Platform.Application.Features.AppOrganizations.Commands.UpdateAppOrganization;

public sealed class UpdateAppOrganizationHandler : IRequestHandler<UpdateAppOrganizationCommand, Result<AppOrganizationDetailItem>>
{
    private readonly IOrganizationRepository _repository;

    public UpdateAppOrganizationHandler(IOrganizationRepository repository) => _repository = repository;

    public async Task<Result<AppOrganizationDetailItem>> Handle(UpdateAppOrganizationCommand request, CancellationToken cancellationToken)
    {
        // Self-parent kontrolü
        if (request.ParentOrganizationId == request.Id) return AppOrganizationErrors.CircularParent;

        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return AppOrganizationErrors.NotFound;

        request.Adapt(entity);

        // Parent değişebilir; Title parent zincirinden yeniden hesaplanır.
        entity.Title = await ComputeHierarchicalTitleAsync(request.OrganizationName, request.ParentOrganizationId, cancellationToken);

        await _repository.UpdateAsync(entity, cancellationToken);
        return entity.Adapt<AppOrganizationDetailItem>();
    }

    private async Task<string> ComputeHierarchicalTitleAsync(string name, Guid? parentId, CancellationToken cancellationToken)
    {
        if (!parentId.HasValue) return name;

        var parent = await _repository.GetAsync(parentId.Value, cancellationToken);
        if (parent is null) return name;

        var parentTitle = parent.Title ?? parent.OrganizationName;
        return $"{parentTitle} \\ {name}";
    }
}
