using Crm.Application.Features.Dashboard.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;

namespace Crm.Application.Features.Dashboard.Queries.ListTopAccounts;

/// <summary>Açık fırsat değerine göre en üst hesaplar (sayfalı).</summary>
public sealed class ListTopAccountsQuery : IQuery<PagedResult<TopAccountItem>>
{
    public PaginationRequest Pagination { get; init; } = new();

    /// <summary>true → sadece oturum kullanıcısının fırsatları; false → erişilebilir tüm organizasyon.</summary>
    public bool OwnerOnly { get; init; }
}
