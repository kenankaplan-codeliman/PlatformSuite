using Crm.Application.Features.Dashboard.Dtos;
using Platform.Application.Common.Abstractions;

namespace Crm.Application.Features.Dashboard.Queries.GetWonThisMonthKpi;

/// <summary>Bu ay kazanılan (ClosedWon) fırsat sayısı + tutarı KPI'ı.</summary>
public sealed class GetWonThisMonthKpiQuery : IQuery<KpiValueItem>
{
    /// <summary>true → sadece oturum kullanıcısının; false → erişilebilir tüm organizasyon.</summary>
    public bool OwnerOnly { get; init; }
}
