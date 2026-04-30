using Platform.Application.Features.AppUsers.Commands.CreateAppUser;
using Platform.Application.Features.AppUsers.Commands.UpdateAppUser;
using Platform.Application.Features.AppUsers.Dtos;
using Platform.Domain.Entities.Identities;
using Mapster;

namespace Platform.Application.Features.AppUsers;

public static class AppUserMappings
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<AppUser, AppUserDetailItem>()
            .Ignore(d => d.OrganizationName!)
            .Ignore(d => d.ManagerName!)
            .Ignore(d => d.Roles!);

        config.NewConfig<AppUser, AppUserListItem>()
            .Ignore(d => d.OrganizationName!)
            .Ignore(d => d.ManagerName!);

        config.NewConfig<CreateAppUserCommand, AppUser>()
            .Ignore(d => d.Id,
                    d => d.Manager!,
                    d => d.AzureUserId!, d => d.PasswordHash!,
                    d => d.CreatedBy, d => d.CreatedAt, d => d.UpdatedBy, d => d.UpdatedAt,
                    d => d.IsDeleted, d => d.DeletedBy, d => d.DeletedAt);

        config.NewConfig<UpdateAppUserCommand, AppUser>()
            .IgnoreNullValues(true)
            .Ignore(d => d.Id,
                    d => d.Manager!,
                    d => d.AzureUserId!, d => d.PasswordHash!,
                    d => d.CreatedBy, d => d.CreatedAt, d => d.UpdatedBy, d => d.UpdatedAt,
                    d => d.IsDeleted, d => d.DeletedBy, d => d.DeletedAt);
    }
}
