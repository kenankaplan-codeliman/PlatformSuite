using Crm.Application.Features.Dashboard.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;

namespace Crm.Application.Features.Dashboard.Queries.ListClosingOpportunities;

/// <summary>Bu ay kapanması beklenen açık fırsatlar (sayfalı).</summary>
public sealed class ListClosingOpportunitiesQuery : IQuery<PagedResult<OpportunityDigestItem>>
{
    public PaginationRequest Pagination { get; init; } = new();

    /// <summary>true → sadece oturum kullanıcısının; false → erişilebilir tüm organizasyon.</summary>
    public bool OwnerOnly { get; init; }
}
