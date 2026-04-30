using Platform.Application.Features.AppOrganizations.Commands.CreateAppOrganization;
using Platform.Application.Features.AppOrganizations.Commands.UpdateAppOrganization;
using Platform.Application.Features.AppOrganizations.Dtos;
using Platform.Application.Mapping;
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
            .Ignore(d => d.Title!, d => d.IsDefault)
            .IgnoreAuditFields();

        config.NewConfig<UpdateAppOrganizationCommand, AppOrganization>()
            .IgnoreNullValues(true)
            .Ignore(d => d.Title!, d => d.IsDefault)
            .IgnoreAuditFields();
    }
}
