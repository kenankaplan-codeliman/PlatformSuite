using Platform.Application.Common.Results;
using Platform.Application.Common.Security;
using Platform.Application.Interfaces;
using MediatR;

namespace Platform.Application.Features.AppUsers.Commands.ChangeAppUserPassword;

public sealed class ChangeAppUserPasswordHandler : IRequestHandler<ChangeAppUserPasswordCommand, Result>
{
    private readonly IAuthUserRepository _repository;
    private readonly IPasswordHasher _passwordHasher;

    public ChangeAppUserPasswordHandler(IAuthUserRepository repository, IPasswordHasher passwordHasher)
    {
        _repository = repository;
        _passwordHasher = passwordHasher;
    }

    public async Task<Result> Handle(ChangeAppUserPasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await _repository.GetAsync(request.UserId, cancellationToken);
        if (user is null) return AppUserErrors.NotFound;

        if (string.IsNullOrEmpty(user.PasswordHash) ||
            !_passwordHasher.Verify(request.CurrentPassword, user.PasswordHash))
        {
            return AppUserErrors.CurrentPasswordInvalid;
        }

        user.PasswordHash = _passwordHasher.Hash(request.NewPassword);
        await _repository.UpdateAsync(user, cancellationToken);

        return Result.Success();
    }
}
