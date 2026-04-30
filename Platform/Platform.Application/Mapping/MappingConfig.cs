using Platform.Application.Features.Accounts;
using Platform.Application.Features.AppOrganizations;
using Platform.Application.Features.AppRoles;
using Platform.Application.Features.AppUsers;
using Platform.Application.Features.Attachments;
using Platform.Application.Features.Contacts;
using Mapster;

namespace Platform.Application.Mapping;

/// <summary>
/// Uygulama genelinde Mapster konfigürasyonunun toplandığı tek giriş noktası.
/// Her entity kendi <c>{Entity}Mappings.Register(config)</c> metodunu sağlar.
/// </summary>
public static class MappingConfig
{
    public static void Register(TypeAdapterConfig config)
    {
        // Base/shared map'ler önce — derived tipler Inherits ile bunlardan beslenir.
        CommunicationsMappings.Register(config);

        AccountMappings.Register(config);
        ContactMappings.Register(config);
        AppOrganizationMappings.Register(config);
        AppUserMappings.Register(config);
        AppRoleMappings.Register(config);
        AttachmentMappings.Register(config);
    }
}
