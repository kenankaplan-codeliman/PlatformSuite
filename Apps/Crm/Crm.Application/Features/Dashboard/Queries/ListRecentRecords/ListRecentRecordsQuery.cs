using Crm.Application.Features.Dashboard.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;

namespace Crm.Application.Features.Dashboard.Queries.ListRecentRecords;

/// <summary>Son eklenen hesap + kişiler, oluşturma tarihine göre birleşik (sayfalı).</summary>
public sealed class ListRecentRecordsQuery : IQuery<PagedResult<RecentRecordItem>>
{
    public PaginationRequest Pagination { get; init; } = new();

    /// <summary>true → sadece oturum kullanıcısının; false → erişilebilir tüm organizasyon.</summary>
    public bool OwnerOnly { get; init; }
}
