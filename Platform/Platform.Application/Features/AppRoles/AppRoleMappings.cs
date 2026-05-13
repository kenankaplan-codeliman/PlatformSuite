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
        config.NewConfig<AuthRole, AppRoleDetailItem>()
            .Ignore(d => d.Privileges!);
        config.NewConfig<AuthRole, AppRoleListItem>();

        config.NewConfig<CreateAppRoleCommand, AuthRole>()
            .IgnoreAuditFields();

        config.NewConfig<UpdateAppRoleCommand, AuthRole>()
            .IgnoreNullValues(true)
            .IgnoreAuditFields();
    }
}
