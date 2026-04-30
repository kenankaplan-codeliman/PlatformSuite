using Platform.Application.Features.AppRoles.Commands.CreateAppRole;
using Platform.Application.Features.AppRoles.Commands.UpdateAppRole;
using Platform.Application.Features.AppRoles.Dtos;
using Platform.Application.Mapping;
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
            .IgnoreAuditFields();

        config.NewConfig<UpdateAppRoleCommand, AppRole>()
            .IgnoreNullValues(true)
            .IgnoreAuditFields();
    }
}
