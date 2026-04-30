namespace Platform.Application.Common.Pagination;

/// <summary>
/// Paginated response'larda data ile ayrıştırılmış pagination meta bilgisi.
/// </summary>
public class PaginationResponse
{
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public bool HasMoreRecord { get; set; }
}
