using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using MediatR;

namespace Platform.Application.Features.AppUsers.Commands.DeleteAppUser;

public sealed class DeleteAppUserHandler : IRequestHandler<DeleteAppUserCommand, Result>
{
    private readonly IUserRepository _repository;

    public DeleteAppUserHandler(IUserRepository repository) => _repository = repository;

    public async Task<Result> Handle(DeleteAppUserCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return AppUserErrors.NotFound;

        await _repository.DeleteAsync(entity, cancellationToken);
        return Result.Success();
    }
}
