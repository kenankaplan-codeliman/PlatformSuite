using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Results;
using Platform.Application.Features.AppUsers.Dtos;
using Platform.Application.Interfaces;
using Platform.Domain.Entities.Identities;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Platform.Application.Features.AppUsers.Commands.CreateAppUser;

public sealed class CreateAppUserHandler : IRequestHandler<CreateAppUserCommand, Result<AppUserDetailItem>>
{
    private readonly IAuthUserRepository _repository;
    private readonly IApplicationDbContext _db;

    public CreateAppUserHandler(IAuthUserRepository repository, IApplicationDbContext db)
    {
        _repository = repository;
        _db = db;
    }

    public async Task<Result<AppUserDetailItem>> Handle(CreateAppUserCommand request, CancellationToken cancellationToken)
    {
        var emailExists = await _db.AuthUser.AsNoTracking()
            .AnyAsync(u => u.Email.ToLower() == request.Email.ToLower(), cancellationToken);
        if (emailExists) return AppUserErrors.DuplicateEmail;

        var orgExists = await _db.AuthOrganization.AsNoTracking()
            .AnyAsync(o => o.Id == request.OrganizationId, cancellationToken);
        if (!orgExists) return AppUserErrors.OrganizationNotFound;

        if (request.ManagerId.HasValue)
        {
            var managerExists = await _db.AuthUser.AsNoTracking()
                .AnyAsync(u => u.Id == request.ManagerId.Value, cancellationToken);
            if (!managerExists) return AppUserErrors.ManagerNotFound;
        }

        var entity = request.Adapt<AuthUser>();
        await _repository.CreateAsync(entity, cancellationToken);

        var detail = await AppUserDetailBuilder.BuildAsync(_db, entity.Id, cancellationToken);
        if (detail is null) return AppUserErrors.NotFound;
        return detail;
    }
}
