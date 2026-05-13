using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Results;
using Platform.Application.Features.AppOrganizations.Dtos;
using Platform.Application.Interfaces;
using Platform.Domain.Entities.Identities;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Platform.Application.Features.AppOrganizations.Commands.UpdateAppOrganization;

public sealed class UpdateAppOrganizationHandler : IRequestHandler<UpdateAppOrganizationCommand, Result<AppOrganizationDetailItem>>
{
    private readonly IAuthOrganizationRepository _repository;
    private readonly IApplicationDbContext _db;

    public UpdateAppOrganizationHandler(IAuthOrganizationRepository repository, IApplicationDbContext db)
    {
        _repository = repository;
        _db = db;
    }

    public async Task<Result<AppOrganizationDetailItem>> Handle(UpdateAppOrganizationCommand request, CancellationToken cancellationToken)
    {
        // Self-parent kontrolü
        if (request.ParentOrganization?.Id == request.Id) return AppOrganizationErrors.CircularParent;

        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return AppOrganizationErrors.NotFound;

        request.Adapt(entity);

        // Parent değişebilir; Title parent zincirinden yeniden hesaplanır.
        entity.Title = await ComputeHierarchicalTitleAsync(
            request.OrganizationName, request.ParentOrganization?.Id, cancellationToken);

        await _repository.UpdateAsync(entity, cancellationToken);

        // Bu birimin Title'ı değişti; alt ağaçtaki tüm descendant'ların Title'ı da
        // parent zincirinden türediği için yeniden hesaplanmalı.
        await RefreshDescendantTitlesAsync(entity, cancellationToken);

        var dto = await AppOrganizationDetailBuilder.BuildAsync(_db, entity.Id, cancellationToken);
        if (dto is null) return AppOrganizationErrors.NotFound;
        return dto;
    }

    private async Task<string> ComputeHierarchicalTitleAsync(string name, Guid? parentId, CancellationToken cancellationToken)
    {
        if (!parentId.HasValue) return name;

        var parent = await _repository.GetAsync(parentId.Value, cancellationToken);
        if (parent is null) return name;

        var parentTitle = parent.Title ?? parent.OrganizationName;
        return $"{parentTitle} \\ {name}";
    }

    /// <summary>
    /// Verilen birimin alt ağacını BFS ile gezerek her descendant'ın Title'ını
    /// güncel parent zincirine göre yeniden hesaplar. Tek sorguyla tüm aktif
    /// org'lar memory'e yüklenir, parent → children index'i kurulur ve tüm
    /// değişiklikler tek SaveChanges ile yazılır. Cycle koruması `visited` set'i.
    /// </summary>
    private async Task RefreshDescendantTitlesAsync(AuthOrganization root, CancellationToken cancellationToken)
    {
        var allOrgs = await _db.AuthOrganization
            .Where(o => !o.IsDeleted)
            .ToListAsync(cancellationToken);

        var byParent = allOrgs
            .Where(o => o.ParentOrganizationId.HasValue)
            .GroupBy(o => o.ParentOrganizationId!.Value)
            .ToDictionary(g => g.Key, g => g.ToList());

        var queue = new Queue<(Guid Id, string Title)>();
        var rootTitle = root.Title ?? root.OrganizationName;
        queue.Enqueue((root.Id, rootTitle));

        var visited = new HashSet<Guid> { root.Id };
        var anyChanged = false;

        while (queue.Count > 0)
        {
            var (parentId, parentTitle) = queue.Dequeue();
            if (!byParent.TryGetValue(parentId, out var children)) continue;

            foreach (var child in children)
            {
                if (!visited.Add(child.Id)) continue; // cycle koruması

                var newTitle = $"{parentTitle} \\ {child.OrganizationName}";
                if (child.Title != newTitle)
                {
                    child.Title = newTitle;
                    anyChanged = true;
                }

                queue.Enqueue((child.Id, newTitle));
            }
        }

        if (anyChanged)
            await _db.SaveChangesAsync(cancellationToken);
    }
}
