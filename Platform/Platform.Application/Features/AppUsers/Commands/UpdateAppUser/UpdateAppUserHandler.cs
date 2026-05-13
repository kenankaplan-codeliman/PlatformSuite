using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Results;
using Platform.Application.Features.AppUsers.Dtos;
using Platform.Application.Interfaces;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Platform.Application.Features.AppUsers.Commands.UpdateAppUser;

public sealed class UpdateAppUserHandler : IRequestHandler<UpdateAppUserCommand, Result<AppUserDetailItem>>
{
    private readonly IAuthUserRepository _repository;
    private readonly IApplicationDbContext _db;

    public UpdateAppUserHandler(IAuthUserRepository repository, IApplicationDbContext db)
    {
        _repository = repository;
        _db = db;
    }

    public async Task<Result<AppUserDetailItem>> Handle(UpdateAppUserCommand request, CancellationToken cancellationToken)
    {
        if (request.ManagerId.HasValue && request.ManagerId.Value == request.Id)
            return AppUserErrors.CircularManager;

        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return AppUserErrors.NotFound;

        var emailExists = await _db.AuthUser.AsNoTracking()
            .AnyAsync(u => u.Id != request.Id && u.Email.ToLower() == request.Email.ToLower(), cancellationToken);
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

        entity.Email = request.Email;
        entity.FirstName = request.FirstName;
        entity.LastName = request.LastName;
        entity.PhoneNumber = request.PhoneNumber;
        entity.OrganizationId = request.OrganizationId;
        entity.ManagerId = request.ManagerId;

        await _repository.UpdateAsync(entity, cancellationToken);

        var detail = await AppUserDetailBuilder.BuildAsync(_db, entity.Id, cancellationToken);
        if (detail is null) return AppUserErrors.NotFound;
        return detail;
    }
}
