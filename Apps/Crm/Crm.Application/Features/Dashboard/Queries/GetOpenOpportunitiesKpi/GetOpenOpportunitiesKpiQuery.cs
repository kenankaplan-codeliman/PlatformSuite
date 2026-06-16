using Crm.Application.Features.Dashboard.Dtos;
using Platform.Application.Common.Abstractions;

namespace Crm.Application.Features.Dashboard.Queries.GetOpenOpportunitiesKpi;

/// <summary>Açık fırsat sayısı + toplam tahmini değer KPI'ı.</summary>
public sealed class GetOpenOpportunitiesKpiQuery : IQuery<KpiValueItem>
{
    /// <summary>true → sadece oturum kullanıcısının; false → erişilebilir tüm organizasyon.</summary>
    public bool OwnerOnly { get; init; }
}
