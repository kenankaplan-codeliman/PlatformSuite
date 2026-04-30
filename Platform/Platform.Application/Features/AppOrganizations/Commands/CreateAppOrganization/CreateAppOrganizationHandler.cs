using Platform.Application.Common.Results;
using Platform.Application.Features.AppOrganizations.Dtos;
using Platform.Application.Interfaces;
using Platform.Domain.Entities.Identities;
using Mapster;
using MediatR;

namespace Platform.Application.Features.AppOrganizations.Commands.CreateAppOrganization;

public sealed class CreateAppOrganizationHandler : IRequestHandler<CreateAppOrganizationCommand, Result<AppOrganizationDetailItem>>
{
    private readonly IOrganizationRepository _repository;

    public CreateAppOrganizationHandler(IOrganizationRepository repository) => _repository = repository;

    public async Task<Result<AppOrganizationDetailItem>> Handle(CreateAppOrganizationCommand request, CancellationToken cancellationToken)
    {
        var entity = request.Adapt<AppOrganization>();
        entity.Title = await ComputeHierarchicalTitleAsync(request.OrganizationName, request.ParentOrganizationId, cancellationToken);

        await _repository.CreateAsync(entity, cancellationToken);

        return entity.Adapt<AppOrganizationDetailItem>();
    }

    /// <summary>
    /// Parent zincirini takip ederek hiyerarşik başlığı hesaplar (örn: "Holding \ Şirket \ Şube").
    /// </summary>
    private async Task<string> ComputeHierarchicalTitleAsync(string name, Guid? parentId, CancellationToken cancellationToken)
    {
        if (!parentId.HasValue) return name;

        var parent = await _repository.GetAsync(parentId.Value, cancellationToken);
        if (parent is null) return name;

        var parentTitle = parent.Title ?? parent.OrganizationName;
        return $"{parentTitle} \\ {name}";
    }
}
