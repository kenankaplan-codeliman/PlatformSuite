using Crm.Application.Features.Dashboard.Dtos;
using Platform.Application.Common.Abstractions;

namespace Crm.Application.Features.Dashboard.Queries.GetConversionRateKpi;

/// <summary>Bu ay oluşturulan lead'lerin dönüşüm oranı KPI'ı.</summary>
public sealed class GetConversionRateKpiQuery : IQuery<ConversionRateItem>
{
    /// <summary>true → sadece oturum kullanıcısının; false → erişilebilir tüm organizasyon.</summary>
    public bool OwnerOnly { get; init; }
}
