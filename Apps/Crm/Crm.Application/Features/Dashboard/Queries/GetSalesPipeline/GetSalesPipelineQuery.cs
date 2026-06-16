using Crm.Application.Features.Dashboard.Dtos;
using Platform.Application.Common.Abstractions;

namespace Crm.Application.Features.Dashboard.Queries.GetSalesPipeline;

/// <summary>Açık fırsatların aşama (stage) bazlı kırılımı.</summary>
public sealed class GetSalesPipelineQuery : IQuery<List<PipelineStageItem>>
{
    /// <summary>true → sadece oturum kullanıcısının; false → erişilebilir tüm organizasyon.</summary>
    public bool OwnerOnly { get; init; }
}
