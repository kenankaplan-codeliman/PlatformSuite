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
        // ParentOrganization / ReportsTo entity'de nav property değil — yalnızca FK olarak
        // tutuluyor. EntityReference projection'ı AppOrganizationDetailBuilder içinde ayrı
        // sorguyla doldurulur; Mapster burada bu alanları görmezden gelir.
        config.NewConfig<AuthOrganization, AppOrganizationDetailItem>()
            .Ignore(d => d.ParentOrganization!, d => d.ReportsTo!);

        config.NewConfig<AuthOrganization, AppOrganizationListItem>();

        config.NewConfig<CreateAppOrganizationCommand, AuthOrganization>()
            .Map(d => d.ParentOrganizationId, s => s.ParentOrganization != null ? (Guid?)s.ParentOrganization.Id : null)
            .Map(d => d.ReportsTo, s => s.ReportsTo != null ? (Guid?)s.ReportsTo.Id : null)
            .Ignore(d => d.Title!, d => d.IsDefault)
            .IgnoreAuditFields();

        // Update için ParentOrganizationId/ReportsTo açıkça AfterMapping'de set edilir;
        // IgnoreNullValues clear (null) durumunu engellememeli.
        config.NewConfig<UpdateAppOrganizationCommand, AuthOrganization>()
            .IgnoreNullValues(true)
            .Ignore(d => d.ParentOrganizationId, d => d.ReportsTo,
                    d => d.Title!, d => d.IsDefault)
            .IgnoreAuditFields()
            .AfterMapping((src, dst) =>
            {
                dst.ParentOrganizationId = src.ParentOrganization?.Id;
                dst.ReportsTo = src.ReportsTo?.Id;
            });
    }
}
