using Platform.Application.Common.Abstractions;
using Platform.Application.Features.AppUsers.Dtos;

namespace Platform.Application.Features.AppUsers.Commands.CreateAppUser;

public sealed class CreateAppUserCommand : ICommand<AppUserDetailItem>
{
    public string Email { get; init; } = string.Empty;
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public string? PhoneNumber { get; init; }
    public Guid OrganizationId { get; init; }
    public Guid? ManagerId { get; init; }
}
