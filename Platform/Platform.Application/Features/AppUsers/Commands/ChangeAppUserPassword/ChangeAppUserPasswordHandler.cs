using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using MediatR;

namespace Platform.Application.Features.AppUsers.Commands.ChangeAppUserPassword;

public sealed class ChangeAppUserPasswordHandler : IRequestHandler<ChangeAppUserPasswordCommand, Result>
{
    private readonly IUserRepository _repository;

    public ChangeAppUserPasswordHandler(IUserRepository repository) => _repository = repository;

    public async Task<Result> Handle(ChangeAppUserPasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await _repository.GetAsync(request.UserId, cancellationToken);
        if (user is null) return AppUserErrors.NotFound;

        if (string.IsNullOrEmpty(user.PasswordHash) ||
            !BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
        {
            return AppUserErrors.CurrentPasswordInvalid;
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        await _repository.UpdateAsync(user, cancellationToken);

        return Result.Success();
    }
}
