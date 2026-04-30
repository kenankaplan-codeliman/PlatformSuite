using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Results;
using Platform.Application.Features.AppRoles.Dtos;
using Platform.Application.Interfaces;
using Platform.Domain.Entities.Identities;
using Platform.Domain.Enums;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Platform.Application.Features.AppRoles.Commands.CreateAppRole;

public sealed class CreateAppRoleHandler : IRequestHandler<CreateAppRoleCommand, Result<AppRoleDetailItem>>
{
    private readonly IRoleRepository _repository;
    private readonly IApplicationDbContext _db;

    public CreateAppRoleHandler(IRoleRepository repository, IApplicationDbContext db)
    {
        _repository = repository;
        _db = db;
    }

    public async Task<Result<AppRoleDetailItem>> Handle(CreateAppRoleCommand request, CancellationToken cancellationToken)
    {
        var name = request.RoleName.Trim();
        var nameExists = await _db.AppRole.AsNoTracking()
            .AnyAsync(r => r.RoleName.ToLower() == name.ToLower(), cancellationToken);
        if (nameExists) return AppRoleErrors.DuplicateName;

        var entity = new AppRole
        {
            RoleName = name,
            Description = request.Description?.Trim(),
            IsDefault = request.IsDefault,
        };
        await _repository.CreateAsync(entity, cancellationToken);

        if (request.Privileges.Count > 0)
        {
            if (!TryMapPrivileges(request.Privileges, out var assignments, out var error))
                return error!;

            await _repository.SyncRolePrivilegesAsync(entity.Id, assignments, cancellationToken);
        }

        var detail = await AppRoleDetailBuilder.BuildAsync(_db, entity.Id, cancellationToken);
        if (detail is null) return AppRoleErrors.NotFound;
        return detail;
    }

    internal static bool TryMapPrivileges(
        List<AppRolePrivilegeItem> input,
        out List<RolePrivilegeAssignment> output,
        out Error? error)
    {
        output = new List<RolePrivilegeAssignment>(input.Count);
        foreach (var p in input)
        {
            if (!Enum.TryParse<AccessLevel>(p.AccessLevel, ignoreCase: true, out var level))
            {
                error = AppRoleErrors.InvalidAccessLevel;
                output = new List<RolePrivilegeAssignment>();
                return false;
            }
            output.Add(new RolePrivilegeAssignment
            {
                PrivilegeCode = p.PrivilegeCode,
                AccessLevel = level,
            });
        }
        error = null;
        return true;
    }
}
