using Crm.Application.Features.Dashboard.Dtos;
using Crm.Domain.Entities.Leads;
using Crm.Domain.Entities.Opportunities;
using Platform.Domain.Entities.Activities;
using Mapster;

namespace Crm.Application.Features.Dashboard;

/// <summary>
/// Dashboard digest DTO'larının Mapster konfigürasyonu. CrmMappingConfig içinden kayıt edilir.
/// Aggregate (KPI/pipeline/top-account) sorguları doğrudan Select projeksiyonu kullandığı için
/// burada yalnız liste digest'leri tanımlanır.
/// </summary>
public static class DashboardMappings
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Opportunity, OpportunityDigestItem>()
            .Map(d => d.Amount, s => s.EstimatedAmount)
            .Map(d => d.AccountName, s => s.Account != null ? s.Account.AccountName : null);

        config.NewConfig<Lead, LeadDigestItem>()
            .Map(d => d.FullName, s => (s.FirstName + " " + s.LastName).Trim());

        // Enum alanlar string'e — bu adapt materialize sonrası bellekte çalışır.
        config.NewConfig<ActivityBase, ActivityDigestItem>()
            .Map(d => d.ActivityType, s => s.ActivityType.ToString())
            .Map(d => d.Status, s => s.Status.ToString())
            .Map(d => d.Priority, s => s.Priority.ToString());
    }
}
