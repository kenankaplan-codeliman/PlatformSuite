using Crm.Application.Features.Accounts;
using Crm.Application.Features.Contacts;
using Crm.Application.Features.Leads;
using Crm.Application.Features.Opportunities;
using Mapster;

namespace Crm.Application.Mapping;

/// <summary>
/// CRM uygulamasının Mapster konfigürasyon ana giriş noktası — Crm.Application/DependencyInjection
/// içinden TypeAdapterConfig.GlobalSettings üzerinde çağrılır. Platform mapping'leri AddApplication
/// tarafından zaten kayıt edilir; CrmMappingConfig onların üzerine ekler.
/// </summary>
public static class CrmMappingConfig
{
    public static void Register(TypeAdapterConfig config)
    {
        AccountMappings.Register(config);
        ContactMappings.Register(config);
        LeadMappings.Register(config);
        OpportunityMappings.Register(config);
    }
}
