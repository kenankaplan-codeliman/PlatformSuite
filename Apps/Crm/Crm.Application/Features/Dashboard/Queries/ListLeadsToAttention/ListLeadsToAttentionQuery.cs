using Crm.Application.Features.Dashboard.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;

namespace Crm.Application.Features.Dashboard.Queries.ListLeadsToAttention;

/// <summary>İlgilenilmesi gereken (dönüştürülmemiş, aktif) lead'ler; skora göre (sayfalı).</summary>
public sealed class ListLeadsToAttentionQuery : IQuery<PagedResult<LeadDigestItem>>
{
    public PaginationRequest Pagination { get; init; } = new();

    /// <summary>true → sadece oturum kullanıcısının; false → erişilebilir tüm organizasyon.</summary>
    public bool OwnerOnly { get; init; }
}
