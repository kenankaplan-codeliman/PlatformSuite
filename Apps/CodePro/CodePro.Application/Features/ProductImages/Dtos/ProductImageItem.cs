namespace CodePro.Application.Features.ProductImages.Dtos;

public sealed class ProductImageItem
{
    public Guid Id { get; init; }
    public Guid ProductId { get; init; }
    public string FileName { get; init; } = string.Empty;
    public string ContentType { get; init; } = string.Empty;
    public long FileSize { get; init; }
    public int SortOrder { get; init; }
    public bool IsDefault { get; init; }
    public DateTime CreatedAt { get; init; }
    public Guid CreatedBy { get; init; }
}
