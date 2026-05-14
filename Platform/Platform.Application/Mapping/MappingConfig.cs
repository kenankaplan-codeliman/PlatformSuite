using Platform.Application.Features.AppOrganizations;
using Platform.Application.Features.AppRoles;
using Platform.Application.Features.AppUsers;
using Platform.Application.Features.Attachments;
using Platform.Application.Features.GeneralParameters;
using Mapster;

namespace Platform.Application.Mapping;

/// <summary>
/// Uygulama genelinde Mapster konfigürasyonunun toplandığı tek giriş noktası.
/// Her entity kendi <c>{Entity}Mappings.Register(config)</c> metodunu sağlar.
/// CRM-spesifik mapping'ler (Account, Contact, Lead, Opportunity) Crm.Application
/// projesindeki CrmMappingConfig içinde kayıt edilir.
/// </summary>
public static class MappingConfig
{
    public static void Register(TypeAdapterConfig config)
    {
        // Base/shared map'ler önce — derived tipler Inherits ile bunlardan beslenir.
        CommunicationsMappings.Register(config);

        AppOrganizationMappings.Register(config);
        AppUserMappings.Register(config);
        AppRoleMappings.Register(config);
        AttachmentMappings.Register(config);
        GeneralParameterMappings.Register(config);
    }
}
