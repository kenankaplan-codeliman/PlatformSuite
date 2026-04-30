using Platform.Application.Features.AppOrganizations.Commands.CreateAppOrganization;
using Platform.Application.Features.AppOrganizations.Commands.UpdateAppOrganization;
using Platform.Application.Features.AppOrganizations.Dtos;
using Platform.Domain.Entities.Identities;
using Mapster;

namespace Platform.Application.Features.AppOrganizations;

public static class AppOrganizationMappings
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<AppOrganization, AppOrganizationDetailItem>();
        config.NewConfig<AppOrganization, AppOrganizationListItem>();

        config.NewConfig<CreateAppOrganizationCommand, AppOrganization>()
            .Ignore(d => d.Id,
                    d => d.Title,
                    d => d.IsDefault,
                    d => d.CreatedBy, d => d.CreatedAt, d => d.UpdatedBy, d => d.UpdatedAt,
                    d => d.IsDeleted, d => d.DeletedBy, d => d.DeletedAt);

        config.NewConfig<UpdateAppOrganizationCommand, AppOrganization>()
            .IgnoreNullValues(true)
            .Ignore(d => d.Id,
                    d => d.Title,
                    d => d.IsDefault,
                    d => d.CreatedBy, d => d.CreatedAt, d => d.UpdatedBy, d => d.UpdatedAt,
                    d => d.IsDeleted, d => d.DeletedBy, d => d.DeletedAt);
    }
}
