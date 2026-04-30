using Platform.Application.Features.AppRoles.Commands.CreateAppRole;
using Platform.Application.Features.AppRoles.Commands.UpdateAppRole;
using Platform.Application.Features.AppRoles.Dtos;
using Platform.Domain.Entities.Identities;
using Mapster;

namespace Platform.Application.Features.AppRoles;

public static class AppRoleMappings
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<AppRole, AppRoleDetailItem>()
            .Ignore(d => d.Privileges!);
        config.NewConfig<AppRole, AppRoleListItem>();

        config.NewConfig<CreateAppRoleCommand, AppRole>()
            .Ignore(d => d.Id,
                    d => d.CreatedBy, d => d.CreatedAt, d => d.UpdatedBy, d => d.UpdatedAt);

        config.NewConfig<UpdateAppRoleCommand, AppRole>()
            .IgnoreNullValues(true)
            .Ignore(d => d.Id,
                    d => d.CreatedBy, d => d.CreatedAt, d => d.UpdatedBy, d => d.UpdatedAt);
    }
}
