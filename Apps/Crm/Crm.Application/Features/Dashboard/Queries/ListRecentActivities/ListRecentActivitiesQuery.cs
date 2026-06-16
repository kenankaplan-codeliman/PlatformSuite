using Crm.Application.Features.Dashboard.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;

namespace Crm.Application.Features.Dashboard.Queries.ListRecentActivities;

/// <summary>Son aktiviteler (en yeni önce). OwnerOnly açıksa yalnız oturum kullanıcısı.</summary>
public sealed class ListRecentActivitiesQuery : IQuery<PagedResult<ActivityDigestItem>>
{
    public PaginationRequest Pagination { get; init; } = new();

    /// <summary>true → sadece oturum kullanıcısının; false → erişilebilir tüm organizasyon.</summary>
    public bool OwnerOnly { get; init; }
}
