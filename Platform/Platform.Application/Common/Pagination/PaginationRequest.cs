namespace Platform.Application.Common.Pagination;

/// <summary>
/// Query request'lerinde pagination parametrelerini gruplamak için standart tip.
/// Yeni list/search query'leri `PaginationRequest Pagination { get; init; }` property'si açar.
/// </summary>
public class PaginationRequest
{
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 10;
}
