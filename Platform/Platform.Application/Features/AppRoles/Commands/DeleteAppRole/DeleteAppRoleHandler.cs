using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using MediatR;

namespace Platform.Application.Features.AppRoles.Commands.DeleteAppRole;

public sealed class DeleteAppRoleHandler : IRequestHandler<DeleteAppRoleCommand, Result>
{
    private readonly IAuthRoleRepository _repository;

    public DeleteAppRoleHandler(IAuthRoleRepository repository) => _repository = repository;

    public async Task<Result> Handle(DeleteAppRoleCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return AppRoleErrors.NotFound;

        await _repository.DeleteAsync(entity, cancellationToken);
        return Result.Success();
    }
}
