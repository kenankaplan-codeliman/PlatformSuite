using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Results;
using Platform.Application.Features.AppRoles.Commands.CreateAppRole;
using Platform.Application.Features.AppRoles.Dtos;
using Platform.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Platform.Application.Features.AppRoles.Commands.UpdateAppRole;

public sealed class UpdateAppRoleHandler : IRequestHandler<UpdateAppRoleCommand, Result<AppRoleDetailItem>>
{
    private readonly IAuthRoleRepository _repository;
    private readonly IApplicationDbContext _db;

    public UpdateAppRoleHandler(IAuthRoleRepository repository, IApplicationDbContext db)
    {
        _repository = repository;
        _db = db;
    }

    public async Task<Result<AppRoleDetailItem>> Handle(UpdateAppRoleCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return AppRoleErrors.NotFound;

        var name = request.RoleName.Trim();
        var nameExists = await _db.AuthRole.AsNoTracking()
            .AnyAsync(r => r.Id != request.Id && r.RoleName.ToLower() == name.ToLower(), cancellationToken);
        if (nameExists) return AppRoleErrors.DuplicateName;

        entity.RoleName = name;
        entity.Description = request.Description?.Trim();
        entity.IsDefault = request.IsDefault;
        await _repository.UpdateAsync(entity, cancellationToken);

        if (request.Privileges is not null)
        {
            if (!CreateAppRoleHandler.TryMapPrivileges(request.Privileges, out var assignments, out var error))
                return error!;

            await _repository.SyncRolePrivilegesAsync(entity.Id, assignments, cancellationToken);
        }

        var detail = await AppRoleDetailBuilder.BuildAsync(_db, entity.Id, cancellationToken);
        if (detail is null) return AppRoleErrors.NotFound;
        return detail;
    }
}
