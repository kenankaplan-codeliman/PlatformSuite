using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using MediatR;

namespace Platform.Application.Features.AppUsers.Commands.UpdateAppUserRoles;

public sealed class UpdateAppUserRolesHandler : IRequestHandler<UpdateAppUserRolesCommand, Result>
{
    private readonly IUserRepository _userRepository;
    private readonly IRoleRepository _roleRepository;

    public UpdateAppUserRolesHandler(IUserRepository userRepository, IRoleRepository roleRepository)
    {
        _userRepository = userRepository;
        _roleRepository = roleRepository;
    }

    public async Task<Result> Handle(UpdateAppUserRolesCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetAsync(request.UserId, cancellationToken);
        if (user is null) return AppUserErrors.NotFound;

        await _roleRepository.SyncUserRolesAsync(request.UserId, request.RoleIds, cancellationToken);
        return Result.Success();
    }
}
