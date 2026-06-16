using Crm.Application.Features.Dashboard.Dtos;
using Platform.Application.Common.Abstractions;

namespace Crm.Application.Features.Dashboard.Queries.GetWonLostSummary;

/// <summary>Bu ay kazanılan/kaybedilen fırsat özeti.</summary>
public sealed class GetWonLostSummaryQuery : IQuery<WonLostItem>
{
    /// <summary>true → sadece oturum kullanıcısının; false → erişilebilir tüm organizasyon.</summary>
    public bool OwnerOnly { get; init; }
}
