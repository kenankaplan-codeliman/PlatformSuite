using Crm.Application.Features.Dashboard.Dtos;
using Platform.Application.Common.Abstractions;

namespace Crm.Application.Features.Dashboard.Queries.GetNewLeadsKpi;

/// <summary>Bu ay oluşturulan yeni lead sayısı KPI'ı.</summary>
public sealed class GetNewLeadsKpiQuery : IQuery<KpiCountItem>
{
    /// <summary>true → sadece oturum kullanıcısının; false → erişilebilir tüm organizasyon.</summary>
    public bool OwnerOnly { get; init; }
}
