using Platform.Application.Features.AppUsers.Commands.CreateAppUser;
using Platform.Application.Features.AppUsers.Commands.UpdateAppUser;
using Platform.Application.Features.AppUsers.Dtos;
using Platform.Application.Mapping;
using Platform.Domain.Entities.Identities;
using Mapster;

namespace Platform.Application.Features.AppUsers;

public static class AppUserMappings
{
    public static void Register(TypeAdapterConfig config)
    {
        // Detail/List item içindeki Organization & Manager EntityReference'ları
        // builder/handler tarafından elle projection ile doldurulur; auto-map yok.
        config.NewConfig<AuthUser, AppUserDetailItem>()
            .Ignore(d => d.Organization!, d => d.Manager!, d => d.Roles!);

        config.NewConfig<AuthUser, AppUserListItem>()
            .Ignore(d => d.Organization!, d => d.Manager!);

        config.NewConfig<CreateAppUserCommand, AuthUser>()
            .Ignore(d => d.Manager!, d => d.AzureUserId!, d => d.PasswordHash!)
            .IgnoreAuditFields();

        config.NewConfig<UpdateAppUserCommand, AuthUser>()
            .IgnoreNullValues(true)
            .Ignore(d => d.Manager!, d => d.AzureUserId!, d => d.PasswordHash!)
            .IgnoreAuditFields();
    }
}
