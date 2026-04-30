namespace Platform.Application.Common.Pagination;

/// <summary>
/// Liste query'lerinin standart response tipi. `Data` iş verisini taşır,
/// `Pagination` meta bilgisini ayrı nested nesnede sunar.
/// </summary>
public class PagedResult<T>
{
    public List<T> Data { get; set; } = new();
    public PaginationResponse Pagination { get; set; } = new();
}
