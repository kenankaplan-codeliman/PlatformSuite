using Crm.Application.Features.Dashboard.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;

namespace Crm.Application.Features.Dashboard.Queries.ListMyTasks;

/// <summary>Açık görev + randevular (bugün/geciken önce). OwnerOnly açıksa yalnız oturum kullanıcısı.</summary>
public sealed class ListMyTasksQuery : IQuery<PagedResult<ActivityDigestItem>>
{
    public PaginationRequest Pagination { get; init; } = new();

    /// <summary>true → sadece oturum kullanıcısının; false → erişilebilir tüm organizasyon.</summary>
    public bool OwnerOnly { get; init; }
}
